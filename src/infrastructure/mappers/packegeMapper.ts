import { PackageApiResponse } from "../../domains/api/api";
import { Package } from "../../domains/package/package";
import { MapperError } from "../../shared/errors/MapperError";

export const mapPackageApiResponse = (apiResp: PackageApiResponse): Package => {
    const d = apiResp.data;
    if (!d) throw new MapperError('API response data missing');

    if (!d.id) throw new MapperError('Package ID is missing from API response');
    if (!d.trackingNumber) throw new MapperError('Tracking number is missing from API response');

    return {
        id: d.id,
        trackingNumber: d.trackingNumber,
        status: d.currentStatus ?? 0
    };
};

export const mapPackageApiList = (apiResp: PackageApiResponse[]): Package[] =>
    apiResp.map(mapPackageApiResponse);
