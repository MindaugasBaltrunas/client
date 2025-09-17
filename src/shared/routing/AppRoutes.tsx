import {  Route, Routes } from "react-router-dom";
import HomePage from "../../presentation/pages/HomePage";


export const AppRoutes: React.FC = () => {
  return (
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
  );
};