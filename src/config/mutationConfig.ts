import { UseMutationOptions } from "@tanstack/react-query";
import { ApiError } from "../shared/errors/ApiError";

export type MutationConfig<TData = unknown, TError = ApiError, TVariables = unknown> = UseMutationOptions<
    TData,
    TError,
    TVariables
> & {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
    toastHandler?: {
        success?: (msg: string) => void;
        error?: (msg: string) => void;
    };
};