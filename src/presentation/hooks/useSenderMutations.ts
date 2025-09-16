import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiClientConfig } from '../../config/type';
import { ApiError } from '../../shared/errors/ApiError';
import { SenderData } from '../../domains/sender/sender';
import { createApiSenderRepository, SenderRepository } from '../../infrastructure/repositories/ApiSenderRepository';
import { createSenderApiClient } from '../../infrastructure/api/clients/SenderApiClient';

export type MutationConfig<TData = unknown, TError = ApiError, TVariables = unknown> = UseMutationOptions<
    TData,
    TError,
    TVariables
> & {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
    toastHandler?: { 
        success?: (msg: string) => void; 
        error?: (msg: string) => void; 
    };
};

export const useSenderMutations = (
    config: ApiClientConfig,
    defaultToastHandler?: { 
        success?: (msg: string) => void; 
        error?: (msg: string) => void; 
    }
) => {
    const queryClient = useQueryClient();
    const apiClient = createSenderApiClient(config);
    const repository: SenderRepository = createApiSenderRepository(apiClient);

    const useCreateSender = (options?: MutationConfig<SenderData, ApiError, SenderData>) =>
        useMutation<SenderData, ApiError, SenderData>({
            mutationFn: (data: SenderData) => repository.create(data),
            onSuccess: (sender, variables, context) => {
                queryClient.invalidateQueries({ queryKey: ['senders', 'list'] });
                
                queryClient.setQueryData(['senders', 'detail', sender.id], sender);
                
                 if (options?.showSuccessToast ?? true) {
                    const message = options?.successMessage ?? 
                        `Sender ${sender.name || sender.id} created successfully!`;
                    const toastHandler = options?.toastHandler?.success ?? defaultToastHandler?.success;
                    toastHandler?.(message);
                }
                
                options?.onSuccess?.(sender, variables, context);
            },
            onError: (error, variables, context) => {
                if (options?.showErrorToast ?? true) {
                    const message = options?.errorMessage ?? 
                        `Failed to create sender: ${error.message ?? 'Unknown error'}`;
                    const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
                    toastHandler?.(message);
                }
                
                options?.onError?.(error, variables, context);
            },
            ...options,
        });

    return {
        useCreateSender,
    };
};

export default useSenderMutations;