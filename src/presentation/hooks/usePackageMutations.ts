import { UseQueryOptions } from '@tanstack/react-query';
import { Package } from '../../domains/package/package';
import { PackageRepository } from '../../infrastructure/repositories/ApiPackageRepository';
import { ApiError } from '../../shared/errors/ApiError';
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

const createToastHandlers = (
    defaultHandler?: ToastHandler,
    options?: {
        showSuccessToast?: boolean;
        showErrorToast?: boolean;
        successMessage?: string;
        errorMessage?: string;
        toastHandler?: ToastHandler;
    }
) => ({
    showSuccess: (defaultMessage: string) => {
        if (options?.showSuccessToast ?? true) {
            const message = options?.successMessage ?? defaultMessage;
            options?.toastHandler?.success?.(message) ?? defaultHandler?.success?.(message);
        }
    },
    showError: (defaultMessage: string, error?: any) => {
        if (options?.showErrorToast ?? true) {
            const message = options?.errorMessage ?? `${defaultMessage}: ${error?.message ?? error}`;
            options?.toastHandler?.error?.(message) ?? defaultHandler?.error?.(message);
        }
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

    const useCreatePackage = (options?: MutationConfig<Package, ApiError, Package>) => {
        const toastHandlers = createToastHandlers(defaultToastHandler, options);

        return repository.useCreatePackage({
            onSuccess: (pkg, variables, context) => {
                toastHandlers.showSuccess(`Package ${pkg.trackingNumber} created successfully!`);
                options?.onSuccess?.(pkg, variables, context);
            },
            onError: (error: Error, variables, context) => {
                const apiError = error as ApiError;
                if (options?.showErrorToast ?? true) {
                    const message = options?.errorMessage ?? `Failed to create recipient: ${apiError.message ?? 'Unknown error'}`;
                    const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
                    toastHandler?.(message);
                }

                options?.onError?.(apiError, variables, context);
            },
        });
    };

    const useUpdatePackageStatus = (
        options?: MutationConfig<Package, ApiError, { packageId: string; status: number }>
    ) => {
        const toastHandlers = createToastHandlers(defaultToastHandler, options);

        return repository.useUpdatePackageStatus({
            onSuccess: (pkg, variables, context) => {
                const statusName = getStatusName(variables.status);
                toastHandlers.showSuccess(`Package status updated to ${statusName}`);
                options?.onSuccess?.(pkg, variables, context);
            },
            onError: (error: Error, variables, context) => {
                const apiError = error as ApiError;
                if (options?.showErrorToast ?? true) {
                    const message = options?.errorMessage ?? `Failed to create recipient: ${apiError.message ?? 'Unknown error'}`;
                    const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
                    toastHandler?.(message);
                }

                options?.onError?.(apiError, variables, context);
            },
        });
    };

    return {
        // Query hooks
        usePackages,
        usePackage,
        usePackageHistory,

        // Mutation hooks
        useCreatePackage,
        useUpdatePackageStatus,

        // Utilities
        PackageStatus,
    };
};

export default usePackageMutations;