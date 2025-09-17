import { useState } from "react";
import { Modal } from "./presentation/components/Modal/Modal";
import { DataTable } from "./presentation/components/Table/Table";
import HomePage from "./presentation/pages/HomePage";
import { AppRoutes } from "./shared/routing/AppRoutes";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return <AppRoutes />;
}

export default App;
