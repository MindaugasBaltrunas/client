import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { ApiError } from '../../shared/errors/ApiError'; 
import { RecipientData } from '../../domains/recipient/recipient';
import { createRecipientApiClient } from '../api/clients/RecipientApiClient';
import { recipientQueryKeys } from './utils/recipientQueryKeys';
import { MappedRecipient, RecipientSchema } from '../mappers/mapApiResponse';

export const createApiRecipientRepository = (recipientApiClient: ReturnType<typeof createRecipientApiClient>) => {
    return {
        useCreateRecipient: (options?: UseMutationOptions<RecipientData, ApiError, RecipientData>) => {
            const queryClient = useQueryClient();
            return useMutation<RecipientData, ApiError, RecipientData>({
                mutationFn: async (data: RecipientData) => {
                    try {
                        const apiRes = await recipientApiClient.createRecipient(data);
                        const result: MappedRecipient = RecipientSchema.parse(apiRes.data)
                        return result;
                    } catch (error) {
                        handleApiError(error, 'createRecipient');
                        throw error; 
                    }
                },
                onSuccess: (newRecipient) => {
                    queryClient.invalidateQueries({ queryKey: recipientQueryKeys.lists() });
                    queryClient.setQueryData(recipientQueryKeys.detail(newRecipient.id), newRecipient);
                },
                ...options,
            });
        }
    };
};

export type RecipientRepository = ReturnType<typeof createApiRecipientRepository>;