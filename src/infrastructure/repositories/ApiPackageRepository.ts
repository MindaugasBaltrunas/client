import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { createPackageApiClient } from '../api/clients/PackageApiClient';
import { Package } from '../../domains/package/package';
import { mapPackageApiResponse, mapPackageApiList } from '../mappers/packegeMapper';

export const packageQueryKeys = {
    all: ['packages'] as const,
    lists: () => [...packageQueryKeys.all, 'list'] as const,
    details: () => [...packageQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...packageQueryKeys.details(), id] as const,
    history: (id: string) => [...packageQueryKeys.all, 'history', id] as const,
};

const handleNotFound = (error: unknown): null => {
    if (error instanceof Error && /(404|not found)/i.test(error.message)) {
        return null;
    }
    throw error;
};

export const createApiPackageRepository = (packageApiClient: ReturnType<typeof createPackageApiClient>) => {
    return {
        usePackages: (options?: UseQueryOptions<Package[]>) =>
            useQuery<Package[]>({
                queryKey: packageQueryKeys.lists(),
                queryFn: async () => {
                    const apiRes = await packageApiClient.getPackages();
                    return mapPackageApiList(apiRes);
                },
                ...options,
            }),

        usePackage: (id: string, options?: UseQueryOptions<Package | null>) =>
            useQuery<Package | null>({
                queryKey: packageQueryKeys.detail(id),
                queryFn: async () => {
                    try {
                        const apiRes = await packageApiClient.getPackage(id);
                        return mapPackageApiResponse(apiRes);
                    } catch (error) {
                        return handleNotFound(error);
                    }
                },
                enabled: !!id,
                ...options,
            }),

        usePackageHistory: (id: string, options?: UseQueryOptions<Package[] | null>) =>
            useQuery<Package[] | null>({
                queryKey: packageQueryKeys.history(id),
                queryFn: async () => {
                    const apiRes = await packageApiClient.getPackageHistory(id);
                    return mapPackageApiList(apiRes);
                },
                enabled: !!id,
                ...options,
            }),

        useCreatePackage: (options?: UseMutationOptions<Package, Error, Package>) => {
            const queryClient = useQueryClient();
            return useMutation<Package, Error, Package>({
                mutationFn: async (data: Package) => {
                    const apiRes = await packageApiClient.createPackage(data);
                    return mapPackageApiResponse(apiRes);
                },
                onSuccess: (pkg) => {
                    queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
                    queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);
                },
                ...options,
            });
        },

        useUpdatePackageStatus: (options?: UseMutationOptions<Package, Error, { packageId: string; status: number }>) => {
            const queryClient = useQueryClient();
            return useMutation<Package, Error, { packageId: string; status: number }>({
                mutationFn: async ({ packageId, status }) => {
                    const apiRes = await packageApiClient.updatePackageStatus(packageId, status);
                    return mapPackageApiResponse(apiRes);
                },
                onSuccess: (pkg) => {
                    queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);
                    queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
                    queryClient.invalidateQueries({ queryKey: packageQueryKeys.history(pkg.id) });
                },
                ...options,
            });
        },

        async getAll(): Promise<Package[]> {
            const apiRes = await packageApiClient.getPackages();
            return mapPackageApiList(apiRes);
        },

        async findById(id: string): Promise<Package | null> {
            try {
                const apiRes = await packageApiClient.getPackage(id);
                return mapPackageApiResponse(apiRes);
            } catch (error) {
                return handleNotFound(error);
            }
        },

        async getHistory(id: string): Promise<Package[]> {
            const apiRes = await packageApiClient.getPackageHistory(id);
            return mapPackageApiList(apiRes);
        },

        async create(data: Package): Promise<Package> {
            const apiRes = await packageApiClient.createPackage(data);
            return mapPackageApiResponse(apiRes);
        },

        async updateStatus(packageId: string, status: number): Promise<Package> {
            const apiRes = await packageApiClient.updatePackageStatus(packageId, status);
            return mapPackageApiResponse(apiRes);
        },
    };
};

export type PackageRepository = ReturnType<typeof createApiPackageRepository>;
