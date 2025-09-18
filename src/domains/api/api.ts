import { PackageHistory } from "../package/packageHistory";
import { PackageResponse } from "../package/packageResponse";
import { RecipientData } from "../recipient/recipient";
import { SenderData } from "../sender/sender";


export interface ApiResponse<T> {
  isSuccessful: boolean;
  data: T | null;
  errors: string[];
  errorMessage: string | null;
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
  code: string;
  statusCode?: number;
  errors?: string[];
  context: string;
  timestamp: string;
}

export type PackageApiResponse = ApiResponse<PackageResponse>;
export type PackageListApiHistoryResponse = ApiResponse<PackageHistory>;
export type PackageListApiResponse = ApiResponse<PackageResponse[]>;
export type RecipientApiResponse = ApiResponse<RecipientData>;
export type SenderApiResponse = ApiResponse<SenderData>;