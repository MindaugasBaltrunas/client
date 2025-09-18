import { format } from "date-fns";
import PackageDetail from "../Card/PackageDetail";

interface PackageInformationProps {
  packageData: {
    id: string;
    status: string;
    createdAt?: string;
  };
}

const PackageInformation = ({ packageData }: PackageInformationProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Package Information</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PackageDetail label="Package ID" value={packageData.id} />
        <PackageDetail label="Current Status" value={packageData.status} />
        <PackageDetail 
          label="Created Date" 
          value={packageData.createdAt ? format(new Date(packageData.createdAt), "PPP 'at' p") : undefined} 
        />
      </dl>
    </div>
  );
};

export default PackageInformation;