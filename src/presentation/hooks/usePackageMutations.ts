import { MutationFunctionContext, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { Package } from '../../domains/package/package';
import { createApiPackageRepository } from '../../infrastructure/repositories/ApiPackageRepository';
import { ApiErrorResponse } from '../../domains/api/api';
import { PackageStatus } from '../../domains/packageStatus/packageStatus';
import { MutationConfig } from '../../config/mutationConfig';
import { createPackageApiClient } from '../../infrastructure/api/clients/PackageApiClient';
import { getDefaultApiConfig } from '../../config/api';
import { ApiClientConfig } from '../../config/type';
import { ToastHandler } from './type';
import { CreatePackage } from '../../domains/package/createPackage';
import { MappedPackage } from '../../infrastructure/mappers/mapApiResponse';
import { packageQueryKeys } from '../../infrastructure/repositories/utils/packageQueryKeys';
import { PackageHistory } from '../../domains/package/packageHistory';

const statusNameMap: Record<number, string> = {
    [PackageStatus.Created]: 'Created',
    [PackageStatus.Sent]: 'In Transit',
    [PackageStatus.Accepted]: 'Delivered',
    [PackageStatus.Cancelled]: 'Canceled',
    [PackageStatus.Returned]: 'Returned',
};

const getStatusName = (status: number): string => statusNameMap[status] ?? 'Unknown';

const createMutationHandlers = <TData, TVariables>(
    defaultToastHandler?: ToastHandler,
    options?: MutationConfig<TData, ApiErrorResponse, TVariables>
) => ({
    handleSuccess: (data: TData, variables: TVariables, onMutateResult: unknown, context: MutationFunctionContext, defaultMessage: string) => {
        if (options?.showSuccessToast ?? true) {
            const message = options?.successMessage ?? defaultMessage;
            const toastHandler = options?.toastHandler?.success ?? defaultToastHandler?.success;
            toastHandler?.(message);
        }
        options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    handleError: (error: ApiErrorResponse, variables: TVariables, onMutateResult: unknown, context: MutationFunctionContext, defaultMessage: string) => {
        if (options?.showErrorToast ?? true) {
            const message = options?.errorMessage ?? `${defaultMessage}: ${error.message ?? 'Unknown error'}`;
            const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
            toastHandler?.(message);
        }
        options?.onError?.(error, variables, onMutateResult, context);
    },
});

export const usePackageMutations = (
    defaultToastHandler?: ToastHandler,
    config?: ApiClientConfig
) => {
    const apiConfig = config ? config : getDefaultApiConfig()
    const packageApiClient = createPackageApiClient(apiConfig);
    const repository = createApiPackageRepository(packageApiClient);
    const queryClient = useQueryClient();

    const usePackages = (options?: UseQueryOptions<Package[]>) =>
        repository.usePackages(options);

    const usePackage = (id: string, options?: UseQueryOptions<Package | null>) =>
        repository.usePackage(id, options);

    const usePackageHistory = (id: string) =>
        repository.usePackageHistory(id);

    const useCreatePackage = (options?: MutationConfig<MappedPackage, ApiErrorResponse, CreatePackage>) => {
        const handlers = createMutationHandlers(defaultToastHandler, options);

        return repository.useCreatePackageRaw({
            onSuccess: (pkg, variables, onMutateResult, context) => {
                queryClient.setQueryData<Package[]>(packageQueryKeys.lists(), (oldData) => {
                    if (!oldData) return [pkg];
                    const newData = [pkg, ...oldData];
                    return newData;
                });

                // queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);

                // Invalidate to ensure consistency
                // queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });

                console.log('Cache update completed');

                // STEP 2: HANDLE TOAST NOTIFICATIONS
                handlers.handleSuccess(
                    pkg,
                    variables,
                    onMutateResult,
                    context,
                    `Package ${pkg.trackingNumber} created successfully!`
                );

                console.log('=== usePackageMutations: CACHE UPDATE COMPLETED ===');
            },
            onError: (error: ApiErrorResponse, variables, onMutateResult, context) => {
                handlers.handleError(error, variables, onMutateResult, context, 'Failed to create package');
            },
            // Don't spread options here as it would override our onSuccess
            mutationKey: options?.mutationKey,
            retry: options?.retry,
            retryDelay: options?.retryDelay,
        });
    };

    const useUpdatePackageStatus = (
        options?: MutationConfig<Package, ApiErrorResponse, { packageId: string; status: number }>
    ) => {
        const handlers = createMutationHandlers(defaultToastHandler, options);

        return repository.useUpdatePackageStatusRaw({
            onSuccess: (pkg, variables, onMutateResult, context) => {
                console.log('=== usePackageMutations: STATUS UPDATE STARTED ===');

                // STEP 1: DO CACHE INVALIDATION FIRST
                queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);
                // queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
                queryClient.invalidateQueries({ queryKey: packageQueryKeys.history(pkg.id) });

                // STEP 2: HANDLE TOAST NOTIFICATIONS
                const statusName = getStatusName(variables.status);
                handlers.handleSuccess(
                    pkg,
                    variables,
                    onMutateResult,
                    context,
                    `Package status updated to ${statusName}`
                );

                console.log('=== usePackageMutations: STATUS UPDATE COMPLETED ===');
            },
            onError: (error: ApiErrorResponse, variables, onMutateResult, context) => {
                handlers.handleError(error, variables, onMutateResult, context, 'Failed to update package status');
            },
            mutationKey: options?.mutationKey,
            retry: options?.retry,
            retryDelay: options?.retryDelay,
        });
    };

    return {
        usePackages,
        usePackage,
        usePackageHistory,

        useCreatePackage,
        useUpdatePackageStatus,

        PackageStatus,
    };
};

export default usePackageMutations;