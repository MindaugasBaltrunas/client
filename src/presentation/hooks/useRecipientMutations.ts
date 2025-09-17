import { ApiClientConfig } from '../../config/type';
import { ApiError } from '../../shared/errors/ApiError';
import { createApiRecipientRepository, RecipientRepository } from '../../infrastructure/repositories/ApiRecipientRepository';
import { createRecipientApiClient } from '../../infrastructure/api/clients/RecipientApiClient';
import { RecipientData } from '../../domains/recipient/recipient';
import { MutationConfig } from '../../config/mutationConfig'
import { ApiErrorResponse } from '../../domains/api/api';

const useRecipientMutations = (
    config: ApiClientConfig,
    defaultToastHandler?: {
        success?: (msg: string) => void;
        error?: (msg: string) => void;
    }
) => {
    const apiClient = createRecipientApiClient(config);
    const repository: RecipientRepository = createApiRecipientRepository(apiClient);

    const useCreateRecipient = (options?: MutationConfig<RecipientData, ApiErrorResponse, RecipientData>) => {
        return repository.useCreateRecipient({
            onSuccess: (recipient, variables, context) => {
                if (options?.showSuccessToast ?? true) {
                    const message = options?.successMessage ??
                        `Recipient ${recipient.name || recipient.id} created successfully!`;
                    const toastHandler = options?.toastHandler?.success ?? defaultToastHandler?.success;
                    toastHandler?.(message);
                }
                options?.onSuccess?.(recipient, variables, context);
            },
            onError: (error: ApiErrorResponse, variables, context) => {
                if (options?.showErrorToast ?? true) {
                    const message = options?.errorMessage ?? `Failed to create recipient: ${error.message ?? 'Unknown error'}`;
                    const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
                    toastHandler?.(message);
                }

                options?.onError?.(error, variables, context);
            },
            ...options,
        });
    };

    return {
        useCreateRecipient
    };
};

export default useRecipientMutations;