import { ApiClientConfig } from "../../../config/type";
import {
  PackageApiResponse
} from "../../../domains/api/api";
import { CreatePackage } from "../../../domains/package/createPackage";
import { request } from "../utils/request";

export function createPackageApiClient(config: ApiClientConfig) {
  return {
    getPackages: () => request<PackageApiResponse[]>("/Package", {}, config),
    getPackage: (id: string) => request<PackageApiResponse>(`/Package/${id}`, {}, config),
    getPackageHistory: (id: string) => request<PackageApiResponse[]>(`/Package/history/${id}`, {}, config),
    createPackage: (data: CreatePackage) =>
      request<PackageApiResponse>("/Package", { method: "POST", body: JSON.stringify(data) }, config),
    updatePackageStatus: (id: string, status: number) =>
      request<PackageApiResponse>(`/Package/${id}/status/${status}`, { method: "PUT" }, config)
  };
}
