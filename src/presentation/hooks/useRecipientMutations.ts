import { ApiClientConfig } from '../../config/type';
import { createApiRecipientRepository, RecipientRepository } from '../../infrastructure/repositories/ApiRecipientRepository';
import { createRecipientApiClient } from '../../infrastructure/api/clients/RecipientApiClient';
import { RecipientData } from '../../domains/recipient/recipient';
import { MutationConfig } from '../../config/mutationConfig'
import { ApiErrorResponse } from '../../domains/api/api';
import { ToastHandler } from './type';

const useRecipientMutations = (
    config: ApiClientConfig,
    defaultToastHandler?: ToastHandler
) => {
    const apiClient = createRecipientApiClient(config);
    const repository: RecipientRepository = createApiRecipientRepository(apiClient);

    const useCreateRecipient = (options?: MutationConfig<RecipientData, ApiErrorResponse, RecipientData>) => {
        return repository.useCreateRecipient({
            onSuccess: (recipient, variables, onMutateResult,context) => {
                if (options?.showSuccessToast ?? true) {
                    const message = options?.successMessage ??
                        `Recipient ${recipient.name || recipient.id} created successfully!`;
                    const toastHandler = options?.toastHandler?.success ?? defaultToastHandler?.success;
                    toastHandler?.(message);
                }
               options?.onSuccess?.(recipient, variables, onMutateResult, context);
            },
            onError: (error: ApiErrorResponse, variables, onMutateResult, context) => {
                if (options?.showErrorToast ?? true) {
                    const message = options?.errorMessage ?? `Failed to create recipient: ${error.message ?? 'Unknown error'}`;
                    const toastHandler = options?.toastHandler?.error ?? defaultToastHandler?.error;
                    toastHandler?.(message);
                }

                options?.onError?.(error, variables, onMutateResult, context);
            },
            ...options,
        });
    };

    return {
        useCreateRecipient
    };
};

export default useRecipientMutations;