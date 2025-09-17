import { ApiClientConfig } from "./type";

export const getDefaultApiConfig = (): ApiClientConfig => ({
    baseUrl: 'http://localhost:5013',
    apiVersion: 'v1',
    timeout: 30000,
    headers: {
        Accept: 'application/json',
    },
});