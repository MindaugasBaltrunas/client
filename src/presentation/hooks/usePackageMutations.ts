import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { Package } from '../../domains/package/package';
import { PackageRepository, createApiPackageRepository } from '../../infrastructure/repositories/ApiPackageRepository';
import { createPackageApiClient } from '../../infrastructure/api/clients/PackageApiClient';
import { ApiClientConfig } from '../../config/type';
import { ApiError } from '../../shared/errors/ApiError';

export type MutationConfig<TData = unknown, TError = ApiError, TVariables = unknown> = UseMutationOptions<
    TData,
    TError,
    TVariables
> & {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
    toastHandler?: { success?: (msg: string) => void; error?: (msg: string) => void };
};

// -----------------------------
// Status utils
// -----------------------------
export enum PackageStatus {
    CREATED = 0,
    IN_TRANSIT = 1,
    OUT_FOR_DELIVERY = 2,
    DELIVERED = 3,
    RETURNED = 4,
    CANCELED = 5,
}

const statusNameMap: Record<number, string> = {
    [PackageStatus.CREATED]: 'Created',
    [PackageStatus.IN_TRANSIT]: 'In Transit',
    [PackageStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [PackageStatus.DELIVERED]: 'Delivered',
    [PackageStatus.RETURNED]: 'Returned',
    [PackageStatus.CANCELED]: 'Canceled',
};

export const getStatusName = (status: number): string => statusNameMap[status] ?? 'Unknown';

// -----------------------------
// usePackageMutations factory
// -----------------------------
export const usePackageMutations = (
    config: ApiClientConfig,
    defaultToastHandler?: { success?: (msg: string) => void; error?: (msg: string) => void }
) => {
    const queryClient = useQueryClient();
    const apiClient = createPackageApiClient(config);
    const repository: PackageRepository = createApiPackageRepository(apiClient);

    // -----------------------------
    // useCreatePackage
    // -----------------------------
    const useCreatePackage = (options?: MutationConfig<Package, ApiError, Package>) =>
        useMutation<Package, ApiError, Package>({
            mutationFn: (data: Package) => repository.create(data),
            onSuccess: (pkg, variables, context) => {
                queryClient.invalidateQueries({ queryKey: ['packages', 'list'] });
                queryClient.setQueryData(['packages', 'detail', pkg.id], pkg);

                if (options?.showSuccessToast ?? true) {
                    const message = options?.successMessage ?? `Package ${pkg.trackingNumber} created successfully!`;
                    options?.toastHandler?.success?.(message) ?? defaultToastHandler?.success?.(message);
                }

                options?.onSuccess?.(pkg, variables, context);
            },
            onError: (err, variables, context) => {
                if (options?.showErrorToast ?? true) {
                    const message = options?.errorMessage ?? `Failed to create package: ${(err as any).message ?? err}`;
                    options?.toastHandler?.error?.(message) ?? defaultToastHandler?.error?.(message);
                }
                options?.onError?.(err, variables, context);
            },
            ...options,
        });

    // -----------------------------
    // useUpdatePackageStatus
    // -----------------------------
    const useUpdatePackageStatus = (
        options?: MutationConfig<Package, ApiError, { packageId: string; status: number }>
    ) =>
        useMutation<
            Package, // TData
            ApiError, // TError
            { packageId: string; status: number }, // TVariables
            { previousPackage?: Package; packageId?: string } // TContext
        >({
            mutationFn: ({ packageId, status }) => repository.updateStatus(packageId, status),
            onMutate: async ({ packageId, status }) => {
                await queryClient.cancelQueries({ queryKey: ['packages', 'detail', packageId] });
                const previousPackage = queryClient.getQueryData<Package>(['packages', 'detail', packageId]);
                if (previousPackage) {
                    queryClient.setQueryData(['packages', 'detail', packageId], { ...previousPackage, status });
                }
                return { previousPackage, packageId };
            },
            onError: (err, variables, context) => {
                if (context?.previousPackage && context?.packageId) {
                    queryClient.setQueryData(['packages', 'detail', context.packageId], context.previousPackage);
                }

                if (options?.showErrorToast ?? true) {
                    const message =
                        options?.errorMessage ?? `Failed to update package status: ${(err as any).message ?? err}`;
                    options?.toastHandler?.error?.(message) ?? defaultToastHandler?.error?.(message);
                }

                options?.onError?.(err, variables, context);
            },
            onSuccess: (pkg, variables, context) => {
                queryClient.setQueryData(['packages', 'detail', pkg.id], pkg);
                queryClient.invalidateQueries({ queryKey: ['packages', 'list'] });
                queryClient.invalidateQueries({ queryKey: ['packages', 'history', pkg.id] });

                if (options?.showSuccessToast ?? true) {
                    const statusName = getStatusName(variables.status);
                    const message = options?.successMessage ?? `Package status updated to ${statusName}`;
                    options?.toastHandler?.success?.(message) ?? defaultToastHandler?.success?.(message);
                }

                options?.onSuccess?.(pkg, variables, context);
            },
        });


    return {
        useCreatePackage,
        useUpdatePackageStatus,
        getStatusName,
        PackageStatus,
    };
};

export default usePackageMutations;
