import React from "react";
import { useTheme } from "../../../app/providers/ThemeProvider";


interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header 
      className={`
        ${theme === "light" 
          ? "bg-white text-gray-900 border-gray-200" 
          : "bg-gray-900 text-white border-gray-700"
        } 
        shadow-sm border-b ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">My App</h1>
          
          <button
            onClick={toggleTheme}
            className={`
              px-3 py-2 rounded-md text-sm font-medium
              ${theme === "light"
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                : "bg-gray-800 text-white hover:bg-gray-700"
              }
            `}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;