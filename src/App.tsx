import { useState } from "react";
import { Modal } from "./presentation/components/Modal/Modal";
import { DataTable } from "./presentation/components/Table/Table";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <DataTable />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleModal}
        >
          Open Modal
        </button>

        <Modal isOpen={isModalOpen} toggle={toggleModal}>
          <h2 className="text-3xl font-bold mb-4">Modal Title</h2>
          <p className="text-lg text-gray-700 text-center">
            This is the modal content. Press Escape or click outside to close.
          </p>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={toggleModal}
          >
            Close Modal
          </button>
        </Modal>
      </div>{" "}
    </>
  );
}

export default App;
