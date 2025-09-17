import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300  dark:bg-gray-800 ">
      {children}
    </div>
  );
};

export default Layout;
