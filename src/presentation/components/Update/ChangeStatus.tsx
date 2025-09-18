import { PackageStatus } from "../../../domains/packageStatus/packageStatus";
import usePackageMutations from "../../hooks/usePackageMutations";
import Modal from "../Modal/Modal";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../SelectOptions/SelectField";

interface PropsChangeStatus {
  id: string;
  status: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  selectedStatus: string;
}

const ChangeStatus = ({ id, status, isOpen, onClose }: PropsChangeStatus) => {
  const { useUpdatePackageStatus } = usePackageMutations();
  const updateStatusMutation = useUpdatePackageStatus();

  const getValidNextStatuses = (current: string): string[] => {
    const statusEnum = PackageStatus[current as keyof typeof PackageStatus];

    switch (statusEnum) {
      case PackageStatus.Created:
        return ["Sent", "Cancelled"];
      case PackageStatus.Sent:
        return ["Accepted", "Returned", "Cancelled"];
      case PackageStatus.Returned:
        return ["Sent", "Cancelled"];
      case PackageStatus.Accepted:
      case PackageStatus.Cancelled:
        return [];
      default:
        return [];
    }
  };

  const validStatuses = getValidNextStatuses(status);

  const validationSchema = Yup.object({
    selectedStatus: Yup.string()
      .required("Please select a status")
      .oneOf(validStatuses, "Invalid status selected"),
  });

  const handleFormSubmit = (values: FormValues) => {
    const selectedStatusNumber =
      PackageStatus[values.selectedStatus as keyof typeof PackageStatus];

    if (selectedStatusNumber === undefined) {
      console.error("Invalid package status:", values.selectedStatus);
      return;
    }

    updateStatusMutation.mutate(
      {
        packageId: id,
        status: selectedStatusNumber,
      },
      {
        onSuccess: (data) => {
          console.log("Package status updated:", data);
          onClose();
        },
        onError: (error) => {
          console.error("Failed to update package status:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const initialValues: FormValues = {
    selectedStatus: "",
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} className="max-w-2xl">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Change Package Status</h2>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Current Status:</strong> {status}
          </p>

          {validStatuses.length > 0 ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ isValid, dirty }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="selectedStatus"
                      className="block text-sm font-medium mb-2"
                    >
                      Select New Status:
                    </label>
                    <SelectField
                      name="selectedStatus"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Status --</option>
                      {validStatuses.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        !isValid || !dirty || updateStatusMutation.isPending
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateStatusMutation.isPending
                        ? "Updating..."
                        : "Update Status"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <p className="text-gray-500">
              No status changes available for current status.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatus;
