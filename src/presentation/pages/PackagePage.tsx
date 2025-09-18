import { useParams } from "react-router-dom";
import { format } from "date-fns";
import usePackageMutations from "../hooks/usePackageMutations";

interface PackageDetailProps {
  label: string;
  value: string | undefined;
}

const PackageDetail = ({ label, value }: PackageDetailProps) => (
  <div className="mb-3">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-base text-gray-900">{value || 'N/A'}</dd>
  </div>
);

interface PersonCardProps {
  title: string;
  person: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
}

const PersonCard = ({ title, person }: PersonCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <dl className="space-y-2">
      <PackageDetail label="Name" value={person.name} />
      <PackageDetail label="Phone" value={person.phone} />
      <PackageDetail label="Address" value={person.address} />
    </dl>
  </div>
);

const PackagePage = () => {
  const { id } = useParams<{ id: string }>();
  const { usePackage } = usePackageMutations();
  
  const { data: packageData, isLoading, error } = usePackage(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-gray-600 mb-4">The package you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Package Details
              </h1>
              <p className="text-gray-600">
                Tracking Number: <span className="font-mono font-medium">{packageData.trackingNumber}</span>
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                packageData.status === 'Delivered' 
                  ? 'bg-green-100 text-green-800'
                  : packageData.status === 'Cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {packageData.status}
              </span>
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonCard title="Sender Information" person={packageData.sender} />
          <PersonCard title="Recipient Information" person={packageData.recipient} />
        </div>


      </div>
    </div>
  );
};

export default PackagePage;