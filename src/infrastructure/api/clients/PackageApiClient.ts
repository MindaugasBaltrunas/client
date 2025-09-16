// API Response Wrapper
export interface ApiResponse<T> {
    isSuccessful: boolean;
    data: T | null;
    errors: string[];
    errorMessage: string | null;
}

// Core Data Types
export interface PackageData {
    id: string;
    trackingNumber: string;
    senderId: string;
    recipientId: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    description?: string;
}

// API Response Types (wrapped in ApiResponse)
export type PackageApiResponse = ApiResponse<PackageData>;

export interface CreatePackageRequest {
    trackingNumber: string;
    senderId: string;
    recipientId: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    description?: string;
}

export interface CreateRecipientRequest {
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface CreateSenderRequest {
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    companyName?: string;
}

export interface RecipientData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SenderData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    companyName?: string;
    createdAt: string;
    updatedAt: string;
}

export type PackageListApiResponse = ApiResponse<PackageData[]>;
export type RecipientApiResponse = ApiResponse<RecipientData>;
export type SenderApiResponse = ApiResponse<SenderData>;

// API Client Configuration
export interface ApiClientConfig {
    baseUrl: string;
    apiVersion?: string;
    timeout?: number;
    headers?: Record<string, string>;
}

// Custom Error Types
export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message: string,
        public errors: string[] = [],
        public response?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static fromApiResponse<T>(response: Response, apiResponse: ApiResponse<T>): ApiError {
        const message = apiResponse.errorMessage || apiResponse.errors.join(', ') || 'Unknown error';
        return new ApiError(
            response.status,
            response.statusText,
            message,
            apiResponse.errors,
            apiResponse
        );
    }
}

// Package API Client Implementation
export class PackageApiClient {
    private readonly baseUrl: string;
    private readonly defaultHeaders: Record<string, string>;
    private readonly timeout: number;

    constructor(config: ApiClientConfig) {
        this.baseUrl = `${config.baseUrl}/api/${config.apiVersion || 'v1'}`;
        this.timeout = config.timeout || 30000;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers,
            },
            signal: AbortSignal.timeout(this.timeout),
        };

        try {
            const response = await fetch(url, config);

            // Handle HTTP errors (network issues, 500 errors, etc.)
            if (!response.ok) {
                const errorText = await response.text();
                throw new ApiError(
                    response.status,
                    response.statusText,
                    errorText || `HTTP ${response.status}: ${response.statusText}`,
                    [errorText || `HTTP ${response.status}: ${response.statusText}`]
                );
            }

            // Handle empty responses (like 204 No Content)
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return {} as T;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const apiResponse: ApiResponse<T> = await response.json();

                // Check if the API operation was successful
                if (!apiResponse.isSuccessful) {
                    throw ApiError.fromApiResponse(response, apiResponse);
                }

                // Return the actual data from the wrapper
                return apiResponse.data as T;
            }

            return await response.text() as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            if (error instanceof Error) {
                throw new ApiError(0, 'Network Error', error.message, [error.message]);
            }

            throw new ApiError(0, 'Unknown Error', 'An unknown error occurred', ['An unknown error occurred']);
        }
    }

    // Package endpoints
    async getPackages(): Promise<PackageApiResponse[]> {
        return this.request<PackageApiResponse[]>('/Package');
    }

    async getPackage(id: string): Promise<PackageApiResponse> {
        return this.request<PackageApiResponse>(`/Package/${id}`);
    }

    async getPackageHistory(id: string): Promise<PackageApiResponse[]> {
        return this.request<PackageApiResponse[]>(`/Package/history/${id}`);
    }

    async createPackage(packageData: CreatePackageRequest): Promise<PackageApiResponse> {
        return this.request<PackageApiResponse>('/Package', {
            method: 'POST',
            body: JSON.stringify(packageData),
        });
    }

    async updatePackageStatus(packageId: string, status: number): Promise<PackageApiResponse> {
        return this.request<PackageApiResponse>(`/Package/${packageId}/status/${status}`, {
            method: 'PUT',
        });
    }

    // Recipient endpoints
    async createRecipient(recipientData: CreateRecipientRequest): Promise<RecipientApiResponse> {
        return this.request<RecipientApiResponse>('/Recipient', {
            method: 'POST',
            body: JSON.stringify(recipientData),
        });
    }

    // Sender endpoints
    async createSender(senderData: CreateSenderRequest): Promise<SenderApiResponse> {
        return this.request<SenderApiResponse>('/Sender', {
            method: 'POST',
            body: JSON.stringify(senderData),
        });
    }

    // Utility methods
    setAuthToken(token: string): void {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    removeAuthToken(): void {
        delete this.defaultHeaders['Authorization'];
    }

    updateHeaders(headers: Record<string, string>): void {
        Object.assign(this.defaultHeaders, headers);
    }
}

// Factory function for creating API client instances
export const createPackageApiClient = (config: ApiClientConfig): PackageApiClient => {
    return new PackageApiClient(config);
};

// Usage example and configuration
export const defaultApiConfig: ApiClientConfig = {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    apiVersion: 'v1',
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
    },
};

// Export commonly used types for external usage
/*
export type {
    ApiResponse,
    PackageData,
    CreatePackageRequest,
    CreateRecipientRequest,
    CreateSenderRequest,
    RecipientData,
    SenderData,
    ApiClientConfig,
};*/
