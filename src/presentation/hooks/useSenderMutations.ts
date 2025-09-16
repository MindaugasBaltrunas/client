import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClientConfig } from '../../config/type';
import { ApiError } from '../../shared/errors/ApiError';
import { SenderData } from '../../domains/sender/sender';
import { createApiSenderRepository, SenderRepository } from '../../infrastructure/repositories/ApiSenderRepository';
import { createSenderApiClient } from '../../infrastructure/api/clients/SenderApiClient';
import { MutationConfig } from '../../config/mutationConfig';


const useSenderMutations = (
    config: ApiClientConfig,
    defaultToastHandler?: {
        success?: (msg: string) => void;
        error?: (msg: string) => void;
    }
) => {
    const apiClient = createSenderApiClient(config);
    const repository: SenderRepository = createApiSenderRepository(apiClient);

    const useCreateSender = (options?: MutationConfig<SenderData, ApiError, SenderData>) => {
        return repository.useCreateSender({
            onSuccess: (recipient, variables, context) => {
                if (options?.showSuccessToast ?? true) {
                    const message = options?.successMessage ??
                        `Recipient ${recipient.name || recipient.id} created successfully!`;
                    const toastHandler = options?.toastHandler?.success ?? defaultToastHandler?.success;
                    toastHandler?.(message);
                }
                options?.onSuccess?.(recipient, variables, context);
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
            ...options,
        });
    };

    return {
        useCreateSender
    };
};

export default useSenderMutations;