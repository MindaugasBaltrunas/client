import { ApiErrorResponse } from "../../../domains/api/api";
import { ApiError } from "../../../shared/errors/ApiError";


export const handleApiError = (error: unknown, context: string): ApiErrorResponse => {
    const timestamp = new Date().toISOString();

    if (error instanceof ApiError) {
        return {
            status: "error",
            message: error.message,
            code: getErrorCode(error.status),
            statusCode: error.status,
            errors: error.errors,
            context,
            timestamp,
        };
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
            status: "error",
            message: "Network connection failed",
            code: 'NETWORK_ERROR',
            statusCode: 0,
            context,
            timestamp,
        };
    }

    if (error instanceof Error) {
        return {
            status: "error",
            message: error.message,
            code: error.name || 'UNKNOWN_ERROR',
            context,
            timestamp,
        };
    }

    return {
        status: "error",
        message: `${context} occurred`,
        code: 'UNKNOWN_ERROR',
        context,
        timestamp,
    };
};

const getErrorCode = (status: number): string => {
    if (status === 404) return 'NOT_FOUND_ERROR';
    if (status === 409) return 'CONFLICT_ERROR';
    if (status >= 500) return 'SERVER_ERROR';
    if (status >= 400) return 'CLIENT_ERROR';
    return 'API_ERROR';
};