import { PackageResponse } from "../package/packageResponse";
import { RecipientData } from "../recipient/recipient";
import { SenderData } from "../sender/sender";


export interface ApiResponse<T> {
  isSuccessful: boolean;
  data: T | null;
  errors: string[];
  errorMessage: string | null;
}

export type PackageApiResponse = ApiResponse<PackageResponse>;
export type PackageListApiResponse = ApiResponse<PackageResponse[]>;
export type RecipientApiResponse = ApiResponse<RecipientData>;
export type SenderApiResponse = ApiResponse<SenderData>;