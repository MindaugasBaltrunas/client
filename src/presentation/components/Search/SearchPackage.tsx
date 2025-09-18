import { useState, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import usePackageMutations from "../../hooks/usePackageMutations";
import FormInput from "../InputFields/FormInput";
import Modal from "../Modal/Modal";

interface SearchFormValues {
  trackingId: string;
}

const searchSchema = Yup.object().shape({
  trackingId: Yup.string()
    .trim()
    .min(1, "Tracking ID cannot be empty"),
});

const SearchPackage = memo(() => {
  const { usePackageSearch } = usePackageMutations();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: packages,
    isLoading,
    error,
    isError,
  } = usePackageSearch(searchQuery);

  const handleSubmit = (values: SearchFormValues, { resetForm }: { resetForm: () => void }) => {
    setSearchQuery(values.trackingId.trim());
    resetForm();
  };

  const handleCloseModal = () => {
    setSearchQuery("");
  };

  const isModalOpen = packages && packages.length > 0 && !isLoading && !isError;

  return (
    <div>
      <Formik
        initialValues={{ trackingId: "" }}
        validationSchema={searchSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-4">
            <FormInput
              name="trackingId"
              label="Tracking ID"
              type="text"
              required
              placeholder="Enter tracking ID"
              autoComplete="off"
            />
          </Form>
        )}
      </Formik>

      {searchQuery && (
        <div className="mt-4">
          {isLoading && <p>Searching packages...</p>}
          
          {isError && (
            <p className="text-red-600">
              Error: {error?.message || "Failed to search packages"}
            </p>
          )}

          {packages && packages.length === 0 && !isLoading && !isError && (
            <p>No packages found with tracking ID: {searchQuery}</p>
          )}
        </div>
      )}

      <Modal isOpen={!!isModalOpen} toggle={handleCloseModal}>
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Search Results</h4>
          {packages && packages.length > 0 && (
            <div>
              <p>{packages.length} package(s) found</p>
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border border-gray-300 rounded-md p-3 mb-2 cursor-pointer hover:bg-gray-50"
                >
                  <p><strong>Tracking #:</strong> {pkg.trackingNumber}</p>
                  <p><strong>Status:</strong> {pkg.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
});

SearchPackage.displayName = 'SearchPackage';

export default SearchPackage;