import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { TrackingTable } from "../components/Table/Table";
import AddComponent from "../components/Add/AddComponent";
import usePackageMutations from "../hooks/usePackageMutations";
import { Package } from "../../domains/package/package";
import { useToggle } from "../hooks/useToggle";
import GetDeliveringHistory from "../components/Get/GetHistory";

const statusNameMap: Record<string, string> = {
  Created: "Created",
  Sent: "In Transit",
  Accepted: "Delivered",
  Cancelled: "Canceled",
  Returned: "Returned",
};

const getStatusName = (status: string): string =>
  statusNameMap[status] ?? status;

const HomePage = () => {
  const { usePackages } = usePackageMutations();
  const getPackagesQuery = usePackages();

  const [packages, setPackages] = useState<
    { trackingNumber: string; status: string; id: string }[]
  >([]);

  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const historyModal = useToggle();

  useEffect(() => {
    if (getPackagesQuery?.data) {
      const transformedData = getPackagesQuery.data.map((pkg: Package) => ({
        trackingNumber: pkg.trackingNumber,
        id: pkg.id,
        status: getStatusName(pkg.status),
      }));
      setPackages(transformedData);
    }
  }, [getPackagesQuery.data]);

  const handleHistory = (id: string) => {
    setSelectedPackageId(id);
    historyModal.open();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Home
        </h1>
        <AddComponent />
        <TrackingTable
          data={packages}
          onCheckHistory={handleHistory}
          isLoading={getPackagesQuery.isLoading}
        />
      </main>
      <Footer />
      {selectedPackageId && (
        <GetDeliveringHistory
          id={selectedPackageId}
          isOpen={historyModal.isOpen}
          onClose={historyModal.close}
        />
      )}
    </div>
  );
};

export default HomePage;
