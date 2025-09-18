import { format } from "date-fns";
import { useEffect } from "react";
import usePackageMutations from "../../hooks/usePackageMutations";
import Modal from "../Modal/Modal";

interface GetDeliveringHistoryProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const GetDeliveringHistory = ({
  id,
  isOpen,
  onClose,
}: GetDeliveringHistoryProps) => {
  const { usePackageHistory } = usePackageMutations();

  const {
    data: historyData,
    isLoading,
    error,
    refetch,
  } = usePackageHistory(id);

  useEffect(() => {
    if (id && isOpen) {
      refetch();
    }
  }, [id, isOpen, refetch]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Package History</h2>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            <span className="ml-2">Loading history...</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 py-4">
            Error loading history: {error.message}
            <button
              onClick={handleRefresh}
              className="ml-2 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {historyData && !isLoading && (
          <div className="space-y-3">
            {historyData.length > 0 ? (
              historyData.map((entry, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="font-medium">{entry.status}</div>
                  <div className="text-sm text-gray-600">ID: {entry.id}</div>
                  {entry.changedAt && (
                    <div className="text-sm text-gray-500">
                      Changed:{" "}
                      {format(new Date(entry.changedAt), "yyyy-MM-dd HH:mm")}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 py-4">
                No history found for this package.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GetDeliveringHistory;
