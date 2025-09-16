import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { handleApiError } from '../api/errors/ApiErrorHandler';
import { createSenderApiClient } from '../api/clients/SenderApiClient';
import { SenderData } from '../../domains/sender/sender';
import { senderQueryKeys } from './utils/senderQueryKeys';
import { MappedSender, SenderSchema } from '../mappers/mapApiResponse';
import { ApiError } from '../../shared/errors/ApiError';

export const createApiSenderRepository = (senderApiClient: ReturnType<typeof createSenderApiClient>) => {
    return {
        useCreateSender: (options?: UseMutationOptions<SenderData, ApiError, SenderData>) => {
            const queryClient = useQueryClient();
            return useMutation<SenderData, ApiError, SenderData>({
                mutationFn: async (data: SenderData) => {
                    try {
                        const apiRes = await senderApiClient.createSender(data);
                        const result: MappedSender = SenderSchema.parse(apiRes.data)
                        return result;
                    } catch (error) {
                        handleApiError(error, 'createSender');
                        throw error;
                    }
                },
                onSuccess: (newSender) => {
                    queryClient.invalidateQueries({ queryKey: senderQueryKeys.lists() });
                    queryClient.setQueryData(senderQueryKeys.detail(newSender.id), newSender);
                },
                ...options,
            });
        }
    };
};

export type SenderRepository = ReturnType<typeof createApiSenderRepository>;