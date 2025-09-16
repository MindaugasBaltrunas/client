import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { createPackageApiClient } from '../api/clients/PackageApiClient';
import { Package } from '../../domains/package/package';
import { packageQueryKeys } from './utils/packageQueryKeys';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { ApiError } from '../../shared/errors/ApiError';
import { parsePackages } from './utils/parseData';
import { MappedPackage, MappedPackageList, PackageListSchema, PackageSchema } from '../mappers/mapApiResponse';



export const createApiPackageRepository = (packageApiClient: ReturnType<typeof createPackageApiClient>) => {
    return {
        usePackages: (options?: UseQueryOptions<Package[]>) =>
            useQuery<Package[]>({
                queryKey: packageQueryKeys.lists(),
                queryFn: async () => {
                    const apiRes = await packageApiClient.getPackages();
                    const packageResponse = parsePackages(apiRes);
                    const result: MappedPackageList = PackageListSchema.parse(packageResponse);
                    return result;
                },
                ...options,
            }),

        usePackage: (id: string, options?: UseQueryOptions<Package | null>) =>
            useQuery<Package | null>({
                queryKey: packageQueryKeys.detail(id),
                queryFn: async () => {
                    try {
                        const apiRes = await packageApiClient.getPackage(id);
                        const result: MappedPackage = PackageSchema.parse(apiRes);
                        return result;
                    } catch (error) {
                        handleApiError(error, `getPackage(${id})`);

                        if (error instanceof ApiError && error.status === 404) {
                            return null;
                        }
                        throw error;
                    }
                },
                enabled: !!id,
                ...options,
            }),

        usePackageHistory: (id: string, options?: UseQueryOptions<Package[] | null>) =>
            useQuery<Package[] | null>({
                queryKey: packageQueryKeys.history(id),
                queryFn: async () => {
                    try {
                        const apiRes = await packageApiClient.getPackageHistory(id);
                        const packageResponse = parsePackages(apiRes);
                        const result: MappedPackageList = PackageListSchema.parse(packageResponse);
                        return result;
                    } catch (error) {
                        handleApiError(error, `getPackageHistory(${id})`);

                        if (error instanceof ApiError && error.status === 404) {
                            return null;
                        }
                        throw error;
                    }
                },
                enabled: !!id,
                ...options,
            }),

        useCreatePackage: (options?: UseMutationOptions<Package, Error, Package>) => {
            const queryClient = useQueryClient();
            return useMutation<Package, Error, Package>({
                mutationFn: async (data: Package) => {
                    try {
                        const apiRes = await packageApiClient.createPackage(data);
                        const result: MappedPackage = PackageSchema.parse(apiRes.data);
                        return result;
                    } catch (error) {
                        handleApiError(error, 'createPackage');
                        throw error;
                    }
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
                    try {
                        const apiRes = await packageApiClient.updatePackageStatus(packageId, status);
                        const result: MappedPackage = PackageSchema.parse(apiRes.data);
                        return result;
                    } catch (error) {
                        handleApiError(error, `updatePackageStatus(${packageId})`);
                        throw error;
                    }
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
            try {
                const apiRes = await packageApiClient.getPackages();
                const packageResponse = parsePackages(apiRes);
                const result: MappedPackageList = PackageListSchema.parse(packageResponse);
                return result;
            } catch (error) {
                handleApiError(error, 'getAll');
                throw error;
            }
        },

        async findById(id: string): Promise<Package | null> {
            try {
                const apiRes = await packageApiClient.getPackage(id);
                const result: MappedPackage = PackageSchema.parse(apiRes.data);
                return result;
            } catch (error) {
                handleApiError(error, `findById(${id})`);

                if (error instanceof ApiError && error.status === 404) {
                    return null;
                }
                throw error;
            }
        },

        async getHistory(id: string): Promise<Package[]> {
            try {
                const apiRes = await packageApiClient.getPackageHistory(id);
                const result: MappedPackageList = PackageListSchema.parse(apiRes);
                return result;
            } catch (error) {
                handleApiError(error, `getHistory(${id})`);
                throw error;
            }
        },

        async create(data: Package): Promise<Package> {
            try {
                const apiRes = await packageApiClient.createPackage(data);
                const result: MappedPackage = PackageSchema.parse(apiRes.data);
                return result;
            } catch (error) {
                handleApiError(error, 'create');
                throw error;
            }
        },

        async updateStatus(packageId: string, status: number): Promise<Package> {
            try {
                const apiRes = await packageApiClient.updatePackageStatus(packageId, status);
                const result: MappedPackage = PackageSchema.parse(apiRes.data);
                return result;
            } catch (error) {
                handleApiError(error, `updateStatus(${packageId})`);
                throw error;
            }
        },
    };
};

export type PackageRepository = ReturnType<typeof createApiPackageRepository>;
