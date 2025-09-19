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

    const usePackageSearch = (tracking: string, options?: UseQueryOptions<Package[]>) =>
        repository.usePackageSearch(tracking, options);

    const usePackageFilter = (status: number, options?: UseQueryOptions<Package[]>) =>
        repository.usePackageFilter(status, options);

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
                handlers.handleSuccess(
                    pkg,
                    variables,
                    onMutateResult,
                    context,
                    `Package ${pkg.trackingNumber} created successfully!`
                );
            },
            onError: (error: ApiErrorResponse, variables, onMutateResult, context) => {
                handlers.handleError(error, variables, onMutateResult, context, 'Failed to create package');
            },
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
                // const existingData = queryClient.getQueryData(packageQueryKeys.detail(pkg.id));
                // console.log('Existing cache data:', existingData);

                queryClient.setQueryData(packageQueryKeys.detail(pkg.id), pkg);

                queryClient.setQueryData(packageQueryKeys.lists(), (oldPackages: Package[] | undefined) => {
                    if (!oldPackages) return oldPackages;

                    return oldPackages.map(p =>
                        p.id === pkg.id
                            ? { ...p, status: pkg.status }
                            : p
                    );
                });

                const statusName = getStatusName(variables.status);
                handlers.handleSuccess(
                    pkg,
                    variables,
                    onMutateResult,
                    context,
                    `Package status updated to ${statusName}`
                );
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
        usePackageFilter,
        usePackageSearch,
        usePackages,
        usePackage,
        usePackageHistory,

        useCreatePackage,
        useUpdatePackageStatus,

        PackageStatus,
    };
};

export default usePackageMutations;