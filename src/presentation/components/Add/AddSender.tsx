import { Form, Formik } from "formik";
import { SenderData } from "../../../domains/sender/sender";
import AddUserFields from "./AddUserFields";
import { userDataSchema } from "../../validation/userDataSchema";

interface AddSenderProps {
  onSubmit: (values: Omit<SenderData, "id">) => void;
}

const AddSender = ({ onSubmit }: AddSenderProps) => {
  const initialValues: Omit<SenderData, "id"> = {
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

export default AddSender;
