import { useEffect, useState } from "react";
import { format } from "date-fns";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { TrackingTable } from "../components/Table/Table";
import AddComponent from "../components/Add/AddComponent";
import usePackageMutations from "../hooks/usePackageMutations";
import { Package } from "../../domains/package/package";
import { useToggle } from "../hooks/useToggle";
import GetDeliveringHistory from "../components/Get/GetHistory";
import ChangeStatus from "../components/Update/ChangeStatus";
import { TrackingData } from "../components/types/TrackingData";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

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

  const historyModal = useToggle();
  const statusModal = useToggle();

  useEffect(() => {
    if (getPackagesQuery?.data) {
      const transformedData = getPackagesQuery.data.map((pkg: Package) => ({
        trackingNumber: pkg.trackingNumber,
        id: pkg.id,
        status: pkg.status,
        recipient: pkg.recipient.name,
        sender: pkg.sender.name,
        created: format(new Date(pkg.createdAt), "yyyy-MM-dd HH:mm"),
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

  const handlerInfo = (id: string) => {
    navigate(`/package/${id}`, { replace: true });
  };

  return (
    <div className="">
    
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Home
        </h1>
        <AddComponent />
        <TrackingTable
          data={packages as TrackingData[]}
          onStatusClick={handleStatusClick}
          onCheckHistory={handleHistory}
          onCheckInfo={handlerInfo}
          isLoading={getPackagesQuery.isLoading}
        />
      </main>


      {selectedPackageId && (
        <GetDeliveringHistory
          id={selectedPackageId}
          isOpen={historyModal.isOpen}
          onClose={historyModal.close}
        />
      )}

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
