import { ApiResponse } from "../../domains/api/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public errors: string[] = [],
    public response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApiErrorFromApiResponse<T>(
  response: Response,
  apiResponse: ApiResponse<T>
): ApiError {
  const message = apiResponse.errorMessage || apiResponse.errors.join(", ") || "Unknown error";
  return new ApiError(response.status, response.statusText, message, apiResponse.errors, apiResponse);
}
