import React, { FC } from "react";
import { useFormikContext } from "formik";
import FormInput from "../InputFields/FormInput";
import { SenderData } from "../../../domains/sender/sender";
import { RecipientData } from "../../../domains/recipient/recipient";

const AddUserFields: FC = () => {
  const { isSubmitting } = useFormikContext<SenderData | RecipientData>();

  return (
    <div className="max-w-md mx-auto space-y-4">
      <FormInput
        name="name"
        label="Full Name"
        type="text"
        required
        placeholder="Enter user's name"
        autoComplete="name"
      />
      <FormInput
        name="phone"
        label="Phone Number"
        type="tel"
        required
        placeholder="Enter phone number"
        autoComplete="tel"
      />
      <FormInput
        name="address"
        label="Address"
        type="text"
        required
        placeholder="Enter user's address"
        autoComplete="street-address"
      />
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? "Creating..." : "Create Recipient"}
        </button>
      </div>
    </div>
  );
};

export default AddUserFields;