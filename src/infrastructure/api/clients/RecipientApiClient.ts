import { ApiClientConfig } from "../../../config/type";
import {
    RecipientApiResponse
} from "../../../domains/api/api";
import { RecipientData } from "../../../domains/recipient/recipient";
import { request } from "../utils/request";

export function createRecipientApiClient(config: ApiClientConfig) {
    return {
        createRecipient: (data: RecipientData) =>
            request<RecipientApiResponse>("/Recipient", { method: "POST", body: JSON.stringify(data) }, config),
    };
}
