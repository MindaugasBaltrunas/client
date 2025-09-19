import { useState } from "react";
import { SenderData } from "../../../domains/sender/sender";
import useSenderMutations from "../../hooks/useSenderMutations";
import useRecipientMutations from "../../hooks/useRecipientMutations";
import { RecipientData } from "../../../domains/recipient/recipient";
import Modal from "../Modal/Modal";
import AddSender from "./AddSender";
import AddRecipient from "./AddRecipient";
import AddPackage from "./AddPackage";
import { useToggle } from "../../hooks/useToggle";
import usePackageMutations from "../../hooks/usePackageMutations";
import { CreatePackage } from "../../../domains/package/createPackage";
import { v4 as uuidv4 } from "uuid";

interface UserIds {
  sender: string;
  recipient: string;
}

const AddComponent = () => {
  const [ids, setIds] = useState<UserIds>({ sender: "", recipient: "" });

  const senderModal = useToggle();
  const recipientModal = useToggle();
  const packageModal = useToggle();

  const { useCreateSender } = useSenderMutations();
  const { useCreateRecipient } = useRecipientMutations();
  const { useCreatePackage } = usePackageMutations();

  const createSenderMutation = useCreateSender();
  const createRecipientMutation = useCreateRecipient();
  const createPackageMutation = useCreatePackage();

  const handleSenderSubmit = (values: Omit<SenderData, "id">) => {
    createSenderMutation.mutate(values as SenderData, {
      onSuccess: (data) => {
        setIds((prevId) => ({ ...prevId, sender: data.id }));
        senderModal.close();
      },
    });
  };

  const handleRecipientSubmit = (values: Omit<RecipientData, "id">) => {
    createRecipientMutation.mutate(values as RecipientData, {
      onSuccess: (data) => {
        setIds((prevId) => ({ ...prevId, recipient: data.id }));
        recipientModal.close();
      },
    });
  };

  const handlePackageSubmit = () => {
    const createPackage: CreatePackage = {
      trackingNumber: uuidv4(),
      senderId: ids.sender,
      recipientId: ids.recipient,
    };

    createPackageMutation.mutate(createPackage, {
      onSuccess: () => {
        packageModal.close();
        setIds({ sender: "", recipient: "" });
      },
      onError: (error) => {
        console.error("Failed to create package:", error);
      },
    });
  };

  const canCreatePackage = ids.sender && ids.recipient;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={senderModal.open}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Sender
        </button>

        <button
          disabled={!ids.sender}
          onClick={recipientModal.open}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Recipient
        </button>

        <button
          disabled={!canCreatePackage}
          onClick={packageModal.open}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Package
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>Sender: {ids.sender ? "✅ Selected" : "❌ Not selected"}</p>
        <p>Recipient: {ids.recipient ? "✅ Selected" : "❌ Not selected"}</p>
      </div>

      <Modal
        isOpen={senderModal.isOpen}
        toggle={senderModal.toggle}
        className="max-w-2xl"
      >
        <div className="max-w-md mx-auto space-y-4">
          <AddSender onSubmit={handleSenderSubmit} />
        </div>
      </Modal>

      <Modal
        isOpen={recipientModal.isOpen}
        toggle={recipientModal.toggle}
        className="max-w-2xl"
      >
        <div className="max-w-md mx-auto space-y-4">
          <AddRecipient onSubmit={handleRecipientSubmit} />
        </div>
      </Modal>

      <Modal
        isOpen={packageModal.isOpen}
        toggle={packageModal.toggle}
        className="max-w-2xl"
      >
        <AddPackage
          sender={ids.sender}
          recipient={ids.recipient}
          handlePackageSubmit={handlePackageSubmit}
          onClose={packageModal.close}
          createPackageMutation={createPackageMutation}
        />
      </Modal>
    </div>
  );
};

export default AddComponent;
