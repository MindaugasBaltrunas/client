import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "../../app/providers/ThemeProvider";
import HomePage from "../../presentation/pages/HomePage";


export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};