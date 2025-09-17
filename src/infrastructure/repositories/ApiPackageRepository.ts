import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { createPackageApiClient } from '../api/clients/PackageApiClient';
import { Package } from '../../domains/package/package';
import { packageQueryKeys } from './utils/packageQueryKeys';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { parsePackages } from './utils/parseData';
import { MappedPackage, MappedPackageList, PackageListSchema, PackageSchema } from '../mappers/mapApiResponse';
import { ApiErrorResponse } from '../../domains/api/api';
import { CreatePackage } from '../../domains/package/createPackage';

export const createApiPackageRepository = (packageApiClient: ReturnType<typeof createPackageApiClient>) => {
    return {
        usePackages: (options?: UseQueryOptions<Package[]>) =>
            useQuery<Package[]>({
                queryKey: packageQueryKeys.lists(),
                queryFn: async () => {
                    const apiRes = await packageApiClient.getPackages();
                    const packageResponse = parsePackages(apiRes);
                    const result: MappedPackageList = PackageListSchema.parse(apiRes);
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
                        throw handleApiError(error, `getPackage(${id})`);
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
                        throw handleApiError(error, `getPackageHistory(${id})`);
                    }
                },
                enabled: !!id,
                ...options,
            }),

        useCreatePackage: (options?: UseMutationOptions<MappedPackage, ApiErrorResponse, CreatePackage>) => {
            const queryClient = useQueryClient();
            return useMutation<MappedPackage, ApiErrorResponse, CreatePackage>({
                mutationFn: async (data: CreatePackage) => {
                    try {
                        const apiRes = await packageApiClient.createPackage(data);
                        const result: MappedPackage = PackageSchema.parse(apiRes);
                        return result;
                    } catch (error) {
                        throw handleApiError(error, 'createPackage');
                    }
                },
                onSuccess: (pkg) => {
                    queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
                    queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);
                },
                ...options,
            });
        },

        useUpdatePackageStatus: (options?: UseMutationOptions<Package, ApiErrorResponse, { packageId: string; status: number }>) => {
            const queryClient = useQueryClient();
            return useMutation<MappedPackage, ApiErrorResponse, { packageId: string; status: number }>({
                mutationFn: async ({ packageId, status }) => {
                    try {
                        const apiRes = await packageApiClient.updatePackageStatus(packageId, status);
                        const result: MappedPackage = PackageSchema.parse(apiRes);
                        return result;
                    } catch (error) {
                        throw handleApiError(error, `updatePackageStatus(${packageId})`);
                    }
                },
                onSuccess: (pkg) => {
                    queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);
                    queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
                    queryClient.invalidateQueries({ queryKey: packageQueryKeys.history(pkg.id) });
                },
                ...options,
            });
        }
    };
};

export type PackageRepository = ReturnType<typeof createApiPackageRepository>;
