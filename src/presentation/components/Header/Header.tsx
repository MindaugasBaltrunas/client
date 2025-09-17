import React from "react";
import { useTheme } from "../../../app/providers/ThemeProvider";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`bg-sky-950 bg-white text-gray-900 border-gray-200 shadow-sm border-b dark:text-white dark:bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">Package Tracking App</h1>
         
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;