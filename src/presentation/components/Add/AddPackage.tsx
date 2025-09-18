import { UseMutationResult } from "@tanstack/react-query";
import { CreatePackage } from "../../../domains/package/createPackage";
import { ApiErrorResponse } from "../../../domains/api/api";

interface AddPackageProps {
  sender: string;
  recipient: string;
  handlePackageSubmit: () => void;
  onClose: () => void;
  createPackageMutation: UseMutationResult<
    {
      id: string;
      trackingNumber: string;
      status: string;
    },
    ApiErrorResponse,
    CreatePackage,
    unknown
  >;
}

const AddPackage = ({
  sender,
  recipient,
  handlePackageSubmit,
  onClose,
  createPackageMutation,
}: AddPackageProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Package</h2>
      <div className="space-y-2 mb-4">
        <p>
          <strong>Sender ID:</strong> {sender}
        </p>
        <p>
          <strong>Recipient ID:</strong> {recipient}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePackageSubmit}
          disabled={createPackageMutation.isPending}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          {createPackageMutation.isPending ? "Creating..." : "Create Package"}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
      {createPackageMutation.isError && (
        <p className="text-red-500 mt-2">
          Error: {createPackageMutation.error?.message}
        </p>
      )}
    </div>
  );
};

export default AddPackage;
