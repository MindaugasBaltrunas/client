import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import SelectOptions from "../SelectOptions/SelectOptions";

interface StatusFormProps {
  currentStatus?: string;
  validStatuses: string[];
  isDisabled: boolean;
  onSubmit: (values: { selectedStatus: string }) => void;
  onCancel: () => void;
  customClass?: string;
  buttonName?: string;
}

const StatusForm = ({
  currentStatus,
  validStatuses,
  isDisabled,
  onSubmit,
  onCancel,
  customClass,
  buttonName = "Update Status",
}: StatusFormProps) => (
  <div>
    {currentStatus && (
      <p className="mb-4">
        <strong>Current Status:</strong> {currentStatus}
      </p>
    )}
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
        {({ isValid, dirty, setFieldValue, values }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Status:
              </label>
              <Field name="selectedStatus">
                {({ field }: any) => (
                  <SelectOptions
                    options={["", ...validStatuses]}
                    name="selectedStatus"
                    value={field.value}
                    onChange={(event: React.FormEvent<HTMLSelectElement>) => {
                      setFieldValue(
                        "selectedStatus",
                        event.currentTarget.value
                      );
                    }}
                    styles={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                    }}
                  />
                )}
              </Field>
            </div>
            <div className={`flex justify-end space-x-3`}>
              <div className={`${customClass ?? ""}`}>
                <button
                  type="button"
                  onClick={onCancel}
                  className={`px-4 py-2 bg-gray-200 text-gray-600 rounded-md`}
                >
                  Cancel
                </button>
              </div>

              <button
                type="submit"
                disabled={!isValid || !dirty || isDisabled}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                {buttonName}
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
