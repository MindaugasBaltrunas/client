import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../SelectOptions/SelectField";

interface StatusFormProps {
  currentStatus: string;
  validStatuses: string[];
  isDisabled: boolean;
  onSubmit: (values: { selectedStatus: string }) => void;
  onCancel: () => void;
}

const StatusForm = ({ 
  currentStatus, 
  validStatuses, 
  isDisabled, 
  onSubmit, 
  onCancel 
}: StatusFormProps) => (
  <div>
    <p className="mb-4">
      <strong>Current Status:</strong> {currentStatus}
    </p>

    {validStatuses.length > 0 ? (
      <Formik
        initialValues={{ selectedStatus: "" }}
        validationSchema={Yup.object({
          selectedStatus: Yup.string()
            .required("Please select a status")
            .oneOf(validStatuses, "Invalid status"),
        })}
        onSubmit={onSubmit}
      >
        {({ isValid, dirty }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select New Status:
              </label>
              <SelectField
                name="selectedStatus"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isDisabled}
              >
                <option value="">-- Select Status --</option>
                {validStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || !dirty || isDisabled}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Update Status
              </button>
            </div>
          </Form>
        )}
      </Formik>
    ) : (
      <p className="text-gray-500">No status changes available.</p>
    )}
  </div>
);

export default StatusForm;