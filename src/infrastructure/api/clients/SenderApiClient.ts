import { ApiClientConfig } from "../../../config/type";
import {
    SenderApiResponse
} from "../../../domains/api/api";
import { SenderData } from "../../../domains/sender/sender";
import { request } from "../utils/request";

export function createSenderApiClient(config: ApiClientConfig) {
    return {
        createSender: (data: SenderData) =>
            request<SenderApiResponse>("/Sender", { method: "POST", body: JSON.stringify(data) }, config),
    };
}
