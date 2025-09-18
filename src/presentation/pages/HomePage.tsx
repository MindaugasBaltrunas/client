import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { TrackingTable } from "../components/Table/Table";
import AddComponent from "../components/Add/AddComponent";
import usePackageMutations from "../hooks/usePackageMutations";
import { Package } from "../../domains/package/package";
import { useToggle } from "../hooks/useToggle";
import GetDeliveringHistory from "../components/Get/GetHistory";
import ChangeStatus from "../components/Update/ChangeStatus";

const HomePage = () => {
  const { usePackages } = usePackageMutations();
  const getPackagesQuery = usePackages();

  const [packages, setPackages] = useState<
    { trackingNumber: string; status: string; id: string }[]
  >([]);

  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<{
    id: string;
    status: string;
  } | null>(null);

  const [selectedTracking, setSelectedTracking] = useState<string>("");

  const historyModal = useToggle();
  const statusModal = useToggle();

  useEffect(() => {    
    if (getPackagesQuery?.data) {
      const transformedData = getPackagesQuery.data.map((pkg: Package) => ({
        trackingNumber: pkg.trackingNumber,
        id: pkg.id,
        status: pkg.status,
      }));
      setPackages(transformedData);
    }
  }, [getPackagesQuery.data]);

  const handleHistory = (id: string) => {
    setSelectedPackageId(id);
    historyModal.open();
  };

  const handleStatusClick = (status: string, id: string) => {
    setSelectedStatus({ id, status });
    statusModal.open();
  };

  const handleTrackingNumberClick = (id: string) => {
    setSelectedTracking(id);
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
          onStatusClick={handleStatusClick}
          onTrackingNumberClick={handleTrackingNumberClick}
          onCheckHistory={handleHistory}
          isLoading={getPackagesQuery.isLoading}
        />
      </main>
      <Footer />

      {/* Delivery History Modal */}
      {selectedPackageId && (
        <GetDeliveringHistory
          id={selectedPackageId}
          isOpen={historyModal.isOpen}
          onClose={historyModal.close}
        />
      )}

      {/* Change Status Modal */}
      {selectedStatus && (
        <ChangeStatus
          id={selectedStatus.id}
          status={selectedStatus.status}
          isOpen={statusModal.isOpen}
          onClose={statusModal.close}
        />
      )}
    </div>
  );
};

export default HomePage;
