import { UseQueryOptions } from '@tanstack/react-query';
import { Package } from '../../domains/package/package';
import { PackageRepository } from '../../infrastructure/repositories/ApiPackageRepository';
import { ApiErrorResponse } from '../../domains/api/api';
import { PackageStatus } from '../../domains/packageStatus/packageStatus';
import { MutationConfig } from '../../config/mutationConfig';

export type ToastHandler = {
    success?: (msg: string) => void;
    error?: (msg: string) => void;
};

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
    handleSuccess: (data: TData, variables: TVariables, context: unknown, defaultMessage: string) => {
        if (options?.showSuccessToast ?? true) {
            const message = options?.successMessage ?? defaultMessage;
            const toastHandler = options?.toastHandler?.success ?? defaultToastHandler?.success;
            toastHandler?.(message);
        }
        options?.onSuccess?.(data, variables, context);
    },
    
    handleError: (error: ApiErrorResponse, variables: TVariables, context: unknown, defaultMessage: string) => {
        if (options?.showErrorToast ?? true) {
            const message = options?.errorMessage ?? `${defaultMessage}: ${error.message ?? 'Unknown error'}`;
            const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
            toastHandler?.(message);
        }
        options?.onError?.(error, variables, context);
    },
});

export const usePackageMutations = (
    repository: PackageRepository,
    defaultToastHandler?: ToastHandler
) => {
    const usePackages = (options?: UseQueryOptions<Package[]>) =>
        repository.usePackages(options);

    const usePackage = (id: string, options?: UseQueryOptions<Package | null>) =>
        repository.usePackage(id, options);

    const usePackageHistory = (id: string, options?: UseQueryOptions<Package[] | null>) =>
        repository.usePackageHistory(id, options);

    const useCreatePackage = (options?: MutationConfig<Package, ApiErrorResponse, Package>) => {
        const handlers = createMutationHandlers(defaultToastHandler, options);

        return repository.useCreatePackage({
            onSuccess: (pkg, variables, context) => {
                handlers.handleSuccess(
                    pkg, 
                    variables, 
                    context, 
                    `Package ${pkg.trackingNumber} created successfully!`
                );
            },
            onError: (error: ApiErrorResponse, variables, context) => {
                handlers.handleError(error, variables, context, 'Failed to create package');
            },
            ...options,
        });
    };

    const useUpdatePackageStatus = (
        options?: MutationConfig<Package, ApiErrorResponse, { packageId: string; status: number }>
    ) => {
        const handlers = createMutationHandlers(defaultToastHandler, options);

        return repository.useUpdatePackageStatus({
            onSuccess: (pkg, variables, context) => {
                const statusName = getStatusName(variables.status);
                handlers.handleSuccess(
                    pkg, 
                    variables, 
                    context, 
                    `Package status updated to ${statusName}`
                );
            },
            onError: (error: ApiErrorResponse, variables, context) => {
                handlers.handleError(error, variables, context, 'Failed to update package status');
            },
            ...options,
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