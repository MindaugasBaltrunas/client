import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { RecipientData } from '../../domains/recipient/recipient';
import { createRecipientApiClient } from '../api/clients/RecipientApiClient';
import { recipientQueryKeys } from './utils/recipientQueryKeys';
import { MappedRecipient, RecipientSchema } from '../mappers/mapApiResponse';
import { ApiErrorResponse } from '../../domains/api/api';

export const createApiRecipientRepository = (recipientApiClient: ReturnType<typeof createRecipientApiClient>) => {
    return {
        useCreateRecipient: (options?: UseMutationOptions<RecipientData, ApiErrorResponse, RecipientData>) => {
            const queryClient = useQueryClient();
            return useMutation<RecipientData, ApiErrorResponse, RecipientData>({
                mutationFn: async (data: RecipientData) => {
                    try {
                        const apiRes = await recipientApiClient.createRecipient(data);
                        const result: MappedRecipient = RecipientSchema.parse(apiRes)
                        return result;
                    } catch (error) {
                        throw handleApiError(error, 'createRecipient');          
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