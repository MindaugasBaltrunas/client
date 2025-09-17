import { Form, Formik } from "formik";
import { RecipientData } from "../../../domains/recipient/recipient";
import AddUserFields from "./AddUserFields";
import { userDataSchema } from "../../validation/userDataSchema";

interface AddRecipientProps {
  onSubmit: (values: Omit<RecipientData, "id">) => void;
}

const AddRecipient = ({ onSubmit }: AddRecipientProps) => {
  const initialValues: Omit<RecipientData, "id"> = {
    name: "",
    phone: "",
    address: "",
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={userDataSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <AddUserFields />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddRecipient;
