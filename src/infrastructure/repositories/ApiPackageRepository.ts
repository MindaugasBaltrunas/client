import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { createPackageApiClient } from '../api/clients/PackageApiClient';
import { Package } from '../../domains/package/package';
import { packageQueryKeys } from './utils/packageQueryKeys';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { MappedPackage, MappedPackageList, PackageHistoryListSchema, PackageListSchema, PackageSchema } from '../mappers/mapApiResponse';
import { ApiErrorResponse } from '../../domains/api/api';
import { CreatePackage } from '../../domains/package/createPackage';
import { PackageHistory } from '../../domains/package/packageHistory';

/**
 * Pure API Repository - Only handles API calls and basic React Query setup
 * No cache management logic - that's handled by the business layer
 */
export const createApiPackageRepository = (packageApiClient: ReturnType<typeof createPackageApiClient>) => {
    return {
        // ==================== QUERIES ====================

        usePackages: (options?: UseQueryOptions<Package[]>) =>
            useQuery<Package[]>({
                queryKey: packageQueryKeys.lists(),
                queryFn: async () => {
                    const apiRes = await packageApiClient.getPackages();
                    return PackageListSchema.parse(apiRes);
                },
                ...options,
            }),

        usePackage: (id: string, options?: UseQueryOptions<Package | null>) =>
            useQuery<Package | null>({
                queryKey: packageQueryKeys.detail(id),
                queryFn: async () => {
                    try {
                        const apiRes = await packageApiClient.getPackage(id);
                        return PackageSchema.parse(apiRes);
                    } catch (error) {
                        throw handleApiError(error, `getPackage(${id})`);
                    }
                },
                enabled: !!id,
                ...options,
            }),

        usePackageHistory: (id: string) =>
            useQuery<PackageHistory[] | null>({
                queryKey: packageQueryKeys.history(id),
                queryFn: async () => {
                    try {
                        const apiRes = await packageApiClient.getPackageHistory(id);
                        return PackageHistoryListSchema.parse(apiRes);
                    } catch (error) {
                        throw handleApiError(error, `getPackageHistory(${id})`);
                    }
                },
                enabled: !!id,
                staleTime: 0,
                gcTime: 0,
            }),

        // ==================== MUTATIONS ====================

        useCreatePackageRaw: (options?: UseMutationOptions<MappedPackage, ApiErrorResponse, CreatePackage>) =>
            useMutation<MappedPackage, ApiErrorResponse, CreatePackage>({
                mutationFn: async (data: CreatePackage) => {
                    try {
                        const apiRes = await packageApiClient.createPackage(data);
                        return PackageSchema.parse(apiRes);
                    } catch (error) {
                        throw handleApiError(error, 'createPackage');
                    }
                },
                ...options,
            }),

        useUpdatePackageStatusRaw: (options?: UseMutationOptions<MappedPackage, ApiErrorResponse, { packageId: string; status: number }>) =>
            useMutation<MappedPackage, ApiErrorResponse, { packageId: string; status: number }>({
                mutationFn: async ({ packageId, status }) => {
                    try {
                        const apiRes = await packageApiClient.updatePackageStatus(packageId, status);
                        return PackageSchema.parse(apiRes);
                    } catch (error) {
                        throw handleApiError(error, `updatePackageStatus(${packageId})`);
                    }
                },
                ...options,
            })

    };
};

export type PackageRepository = ReturnType<typeof createApiPackageRepository>;