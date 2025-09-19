import { useStatusChange } from "../../hooks/useStatusChange";
import AlertMessage from "../AlertMessage/AlertMessage";
import ConfirmationDialog from "../Confirmation/ConfirmationDialog";
import Modal from "../Modal/Modal";
import StatusForm from "../Status/StatusForm";

interface Props {
  id: string;
  status: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChangeStatus = ({ id, status, isOpen, onClose }: Props) => {
  const {
    showConfirmation,
    pendingStatus,
    message,
    isLoading,
    getValidStatuses,
    handleSubmit,
    handleConfirm,
    handleCancel,
    reset,
  } = useStatusChange(id, onClose);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} className="max-w-2xl">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Change Package Status</h2>

        {message && <AlertMessage type={message.type} message={message.text} />}

        {showConfirmation ? (
          <ConfirmationDialog
            currentStatus={status}
            newStatus={pendingStatus}
            isLoading={isLoading}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ) : (
          <StatusForm
            currentStatus={status}
            validStatuses={getValidStatuses(status)}
            isDisabled={isLoading}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            
          />
        )}
      </div>
    </Modal>
  );
};

export default ChangeStatus;
