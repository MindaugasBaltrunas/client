import { z } from "zod";

export const SenderSchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    address: z.string()
});

export const RecipientSchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    address: z.string()
});

export const PackageHistorySchema = z.object({
    id: z.string(),
    status: z.string(),
    changedAt: z.string()
});

export const PackageSchema = z.object({
    id: z.string(),
    trackingNumber: z.string(),
    currentStatus: z.string(), 
    createdAt: z.string(),
    sender: SenderSchema,
    recipient: RecipientSchema
}).transform((data) => ({
    id: data.id,
    trackingNumber: data.trackingNumber,
    status: data.currentStatus, 
    createdAt: data.createdAt,
    sender: data.sender,
    recipient: data.recipient
}));

export const SimplePackageSchema = z.object({
    id: z.string(),
    trackingNumber: z.string(),
    currentStatus: z.string(),
}).transform((data) => ({
    id: data.id,
    trackingNumber: data.trackingNumber,
    status: data.currentStatus,
}));


export const PackageListSchema = z.array(PackageSchema);
export const SimplePackageListSchema = z.array(SimplePackageSchema);
export const PackageHistoryListSchema = z.array(PackageHistorySchema);


export type MappedSender = z.infer<typeof SenderSchema>;
export type MappedRecipient = z.infer<typeof RecipientSchema>;
export type MappedPackage = z.infer<typeof PackageSchema>;
export type MappedSimplePackage = z.infer<typeof SimplePackageSchema>;
export type MappedPackageHistory = z.infer<typeof PackageHistorySchema>;
export type MappedPackageList = z.infer<typeof PackageListSchema>;
export type MappedSimplePackageList = z.infer<typeof SimplePackageListSchema>;
export type MappedPackageHistoryList = z.infer<typeof PackageHistoryListSchema>;

