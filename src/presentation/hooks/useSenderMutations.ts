import { ApiClientConfig } from '../../config/type';
import { SenderData } from '../../domains/sender/sender';
import { createApiSenderRepository, SenderRepository } from '../../infrastructure/repositories/ApiSenderRepository';
import { createSenderApiClient } from '../../infrastructure/api/clients/SenderApiClient';
import { MutationConfig } from '../../config/mutationConfig';
import { ApiErrorResponse } from '../../domains/api/api';
import { ToastHandler } from './type';


const useSenderMutations = (
    config: ApiClientConfig,
    defaultToastHandler?: ToastHandler
) => {
    const apiClient = createSenderApiClient(config);
    const repository: SenderRepository = createApiSenderRepository(apiClient);

    const useCreateSender = (options?: MutationConfig<SenderData, ApiErrorResponse, SenderData>) => {
        return repository.useCreateSender({
            onSuccess: (recipient, variables, onMutateResult, context) => {
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
        useCreateSender
    };
};

export default useSenderMutations;