import {  Route, Routes } from "react-router-dom";
import { FC, lazy } from "react";

const HomePage = lazy(() => import("../../presentation/pages/HomePage"));
const PackagePage = lazy(() => import("../../presentation/pages/PackagePage"));

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="package/:id" element={<PackagePage />} />
    </Routes>
  );
};