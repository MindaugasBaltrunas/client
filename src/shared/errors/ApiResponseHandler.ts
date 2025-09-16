import { ApiResponse } from "../../domains/api/api";
import { ApiError, createApiErrorFromApiResponse } from "./ApiError";

export const handleApiResponse = async <T>(
  response: Response
): Promise<T> => {
  let apiResponse: ApiResponse<T>;

  try {
    apiResponse = await response.json();
  } catch (parseError) {
    throw new ApiError(
      response.status,
      response.statusText,
      'Failed to parse response',
      [],
      parseError
    );
  }

  if (!response.ok) {
    throw createApiErrorFromApiResponse(response, apiResponse);
  }

  return apiResponse.data || apiResponse as T;
};
