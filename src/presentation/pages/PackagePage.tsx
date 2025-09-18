import { useParams } from "react-router-dom";
import usePackageMutations from "../hooks/usePackageMutations";
import { Package } from "../../domains/package/package";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import ErrorState from "../components/Error/ErrorState";
import PackageHeader from "../components/Header/PackageHeader";
import PackageInformation from "../components/Info/PackageInformation";
import PersonCard from "../components/Card/PersonCard";

interface PropsPackagePage {
  packages?: Package[];
}

const PackagePage = (packages: PropsPackagePage) => {
  
  const { id } = useParams<{ id: string }>();
  const { usePackage } = usePackageMutations();

  const {
    data: packageData,
    isLoading,
    error,
  } = usePackage(id!) as {
    data: Package | undefined;
    isLoading: boolean;
    error: any;
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading package details..." />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!packageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackageHeader
          trackingNumber={packageData.trackingNumber}
          status={packageData.status}
        />

        <PackageInformation packageData={packageData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonCard title="Sender Information" person={packageData.sender} />
          <PersonCard
            title="Recipient Information"
            person={packageData.recipient}
          />
        </div>
      </div>
    </div>
  );
};

export default PackagePage;
