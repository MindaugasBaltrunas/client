import { AppRoutes } from "./shared/routing/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import Layout from "./presentation/layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
