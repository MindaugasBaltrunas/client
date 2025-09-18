import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../app/providers/ThemeProvider";
import SearchPackage from "../Search/SearchPackage";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <header className={`bg-white text-gray-900 border-gray-200 shadow-sm border-b dark:text-white dark:bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 
            onClick={handleHomeClick}
            className="text-xl font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Package Tracking App
          </h1>
          <div>
            <SearchPackage/>
          </div>
         
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;