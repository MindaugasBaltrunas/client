import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Home
        </h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Card 1
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This content should change colors when you toggle the theme.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Card 2
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Both cards should respond to theme changes.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
