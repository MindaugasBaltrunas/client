interface ConfirmationDialogProps {
  currentStatus: string;
  newStatus: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({ 
  currentStatus, 
  newStatus, 
  isLoading, 
  onConfirm, 
  onCancel 
}: ConfirmationDialogProps) => (
  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <h3 className="text-sm font-medium text-yellow-800 mb-2">
      Confirm Status Change
    </h3>
    <p className="text-sm text-yellow-700 mb-4">
      Change from <strong>{currentStatus}</strong> to <strong>{newStatus}</strong>?
    </p>
    <div className="flex space-x-3">
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : 'Confirm'}
      </button>
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ConfirmationDialog;