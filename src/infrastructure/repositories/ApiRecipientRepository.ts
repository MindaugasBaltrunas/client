import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { RecipientData } from '../../domains/recipient/recipient';
import { createRecipientApiClient } from '../api/clients/RecipientApiClient';
import { recipientQueryKeys } from './utils/recipientQueryKeys';
import { MappedRecipient, RecipientSchema } from '../mappers/mapApiResponse';

export const createApiRecipientRepository = (recipientApiClient: ReturnType<typeof createRecipientApiClient>) => {
    return {
        useCreateRecipient: (options?: UseMutationOptions<RecipientData, Error, RecipientData>) => {
            const queryClient = useQueryClient();
            return useMutation<RecipientData, Error, RecipientData>({
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
        },
        async create(data: RecipientData): Promise<RecipientData> {
            try {
                const apiRes = await recipientApiClient.createRecipient(data);
                const result: MappedRecipient = RecipientSchema.parse(apiRes.data);
                return result;
            } catch (error) {
                handleApiError(error, 'create');
                throw error;
            }
        },
    };
};

export type RecipientRepository = ReturnType<typeof createApiRecipientRepository>;