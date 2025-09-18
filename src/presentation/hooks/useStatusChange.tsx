import { useState } from "react";
import usePackageMutations from "./usePackageMutations";
import { PackageStatus } from "../../domains/packageStatus/packageStatus";

export const useStatusChange = (packageId: string, onClose: () => void) => {
  const { useUpdatePackageStatus } = usePackageMutations();
  const updateStatusMutation = useUpdatePackageStatus();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const getValidStatuses = (current: string) => {
    const statusEnum = PackageStatus[current as keyof typeof PackageStatus];
    switch (statusEnum) {
      case PackageStatus.Created: return ["Sent", "Cancelled"];
      case PackageStatus.Sent: return ["Accepted", "Returned", "Cancelled"];
      case PackageStatus.Returned: return ["Sent", "Cancelled"];
      default: return [];
    }
  };

  const handleSubmit = (values: { selectedStatus: string }) => {
    setPendingStatus(values.selectedStatus);
    setShowConfirmation(true);
    setMessage(null);
  };

  const handleConfirm = () => {
    const statusNumber = PackageStatus[pendingStatus as keyof typeof PackageStatus];
    
    updateStatusMutation.mutate(
      { packageId, status: statusNumber },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: `Status updated to ${pendingStatus}` });
          setShowConfirmation(false);
          setTimeout(onClose, 2000);
        },
        onError: (error: any) => {
          setMessage({ type: 'error', text: error?.message || 'Update failed' });
          setShowConfirmation(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingStatus("");
  };

  const reset = () => {
    setMessage(null);
    setShowConfirmation(false);
    setPendingStatus("");
  };

  return {
    showConfirmation,
    pendingStatus,
    message,
    isLoading: updateStatusMutation.isPending,
    getValidStatuses,
    handleSubmit,
    handleConfirm,
    handleCancel,
    reset,
  };
};