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

export const PackageSchema = z.object({
    id: z.string(),
    trackingNumber: z.string(),
    currentStatus: z.string(),
}).transform((data) => ({
    id: data.id,
    trackingNumber: data.trackingNumber,
    status: data.currentStatus,
}));;

export type MappedSender = z.infer<typeof SenderSchema>;
export type MappedRecipient = z.infer<typeof RecipientSchema>;
export type MappedPackage = z.infer<typeof PackageSchema>;
export type MappedPackageList = z.infer<typeof PackageListSchema>;

export const PackageListSchema = z.array(PackageSchema);


