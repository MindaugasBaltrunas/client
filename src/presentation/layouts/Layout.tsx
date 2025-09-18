import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-800">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
