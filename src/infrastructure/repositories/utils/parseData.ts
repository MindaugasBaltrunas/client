import { PackageApiResponse } from "../../../domains/api/api";
import { PackageResponse } from "../../../domains/package/packageResponse";

export const parsePackages = (apiRes: PackageApiResponse[]): PackageResponse[] => {
    return apiRes
        .filter(r => r.isSuccessful && r.data !== null)
        .map(r => r.data as PackageResponse);
}

