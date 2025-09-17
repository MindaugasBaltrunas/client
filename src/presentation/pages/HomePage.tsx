import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { DataTable } from "../components/Table/Table";
import AddComponent from "../components/Add/AddComponent";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Home
        </h1>
        <AddComponent />
        <DataTable />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
