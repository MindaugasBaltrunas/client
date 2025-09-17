import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { SimpleTrackingTable } from "../components/Table/Table";
import AddComponent from "../components/Add/AddComponent";
import usePackageMutations from "../hooks/usePackageMutations";
import { PackageStatus } from "../../domains/packageStatus/packageStatus";
import { Package } from "../../domains/package/package";

// Map numeric status codes to readable strings
const statusNameMap: Record<number, string> = {
  [PackageStatus.Created]: "Created",
  [PackageStatus.Sent]: "In Transit",
  [PackageStatus.Accepted]: "Delivered",
  [PackageStatus.Cancelled]: "Canceled",
  [PackageStatus.Returned]: "Returned",
};

const getStatusName = (status: number | string): string =>
  typeof status === "number" ? statusNameMap[status] ?? "Unknown" : status;

const HomePage = () => {
  const { usePackages } = usePackageMutations();
  const getPackagesQuery = usePackages();

  const [packages, setPackages] = useState<
    { trackingNumber: string; status: string }[]
  >([]);

  useEffect(() => {
    console.log("Query data changed:", {
      data: getPackagesQuery?.data,
      length: getPackagesQuery?.data?.length,
      isLoading: getPackagesQuery.isLoading,
      isFetching: getPackagesQuery.isFetching,
      dataUpdatedAt: getPackagesQuery.dataUpdatedAt,
    });

    if (getPackagesQuery?.data) {
      const transformedData = getPackagesQuery.data.map((pkg: Package) => ({
        trackingNumber:
          pkg.trackingNumber === "[object Object]"
            ? pkg.id
            : pkg.trackingNumber,
        status: getStatusName(pkg.status),
      }));
      setPackages(transformedData);
    }
  }, [
    getPackagesQuery.data,
    getPackagesQuery.data?.length,
    getPackagesQuery.dataUpdatedAt,
    getPackagesQuery.isFetching,
    getPackagesQuery.isLoading,
    getPackagesQuery.isSuccess,
  ]);

  const handleHistory = (trackingNumber: string) => {
    console.log(`Check history for: ${trackingNumber}`);
    // Your history logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Home
        </h1>
        <AddComponent />

        <SimpleTrackingTable
          data={packages}
          onCheckHistory={handleHistory}
          isLoading={getPackagesQuery.isLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
