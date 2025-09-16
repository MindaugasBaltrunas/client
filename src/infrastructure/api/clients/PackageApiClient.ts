import { ApiClientConfig } from "../../../config/type";
import { ApiError, createApiErrorFromApiResponse } from "../../../shared/errors/ApiError";
import {
  ApiResponse,
  PackageApiResponse,
  RecipientApiResponse,
  SenderApiResponse
} from "../../../domains/api/api";
import { Package } from "../../../domains/package/package";

export function createPackageApiClient(config: ApiClientConfig) {
  const baseUrl = `${config.baseUrl}/api/${config.apiVersion || "v1"}`;
  const timeout = config.timeout || 30000;
  let defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    const configWithDefaults: RequestInit = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
      signal: abortController.signal,
    };

    try {
      const response = await fetch(url, configWithDefaults);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          response.status,
          response.statusText,
          errorText || `HTTP ${response.status}: ${response.statusText}`,
          [errorText || `HTTP ${response.status}: ${response.statusText}`]
        );
      }

      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return {} as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const apiResponse: ApiResponse<T> = await response.json();
        if (!apiResponse.isSuccessful) {
           throw createApiErrorFromApiResponse(response, apiResponse);
        }
        return apiResponse.data as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) {
        throw new ApiError(0, "Network Error", error.message, [error.message]);
      }
      throw new ApiError(0, "Unknown Error", "An unknown error occurred", ["An unknown error occurred"]);
    }
  }

  return {
    getPackages: () => request<PackageApiResponse[]>("/Package"),
    getPackage: (id: string) => request<PackageApiResponse>(`/Package/${id}`),
    getPackageHistory: (id: string) => request<PackageApiResponse[]>(`/Package/history/${id}`),
    createPackage: (data: Package) =>
      request<PackageApiResponse>("/Package", { method: "POST", body: JSON.stringify(data) }),
    updatePackageStatus: (id: string, status: number) =>
      request<PackageApiResponse>(`/Package/${id}/status/${status}`, { method: "PUT" }),

    createRecipient: (data: Package) =>
      request<RecipientApiResponse>("/Recipient", { method: "POST", body: JSON.stringify(data) }),

    createSender: (data: Package) =>
      request<SenderApiResponse>("/Sender", { method: "POST", body: JSON.stringify(data) }),
  };
}
