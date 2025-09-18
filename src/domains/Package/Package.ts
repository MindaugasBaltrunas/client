import { RecipientData } from "../recipient/recipient";
import { SenderData } from "../sender/sender";

export interface Package {
    id: string;
    trackingNumber: string;
    status: string;
    createdAt:string;
    sender: SenderData;
    recipient: RecipientData;
}