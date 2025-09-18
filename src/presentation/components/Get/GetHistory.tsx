import { format } from "date-fns";
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
  const { data: historyData, isLoading, error } = usePackageHistory(id);

  return (
    <Modal isOpen={isOpen} toggle={onClose} className="max-w-2xl">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Package History</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            <span className="ml-2">Loading history...</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 py-4">
            Error loading history: {error.message}
          </div>
        )}

        {historyData && (
          <div className="space-y-3">
            {historyData.map((entry, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-medium">{entry.status}</div>
                <div className="text-sm text-gray-600">{entry.id}</div>
                {entry.status && (
                  <div className="text-sm text-gray-500">
                    Changed:
                    {format(new Date(entry.changedAt), "yyyy MM dd HH:mm")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GetDeliveringHistory;
