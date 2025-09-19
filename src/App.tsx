import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { FormikProvider } from "./app/providers/formik/FormikProvider";
import Layout from "./presentation/layouts/Layout";
import { AppRoutes } from "./shared/routing/AppRoutes";
import { QueryProvider } from "./providers/QueryProvider";
import { SelectFieldProvider } from "./app/providers/SelectFieldProvider";

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <FormikProvider
            config={{
              validateOnBlur: false,
              validateOnChange: true,
              validateOnMount: false,
            }}
          >
            <SelectFieldProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </SelectFieldProvider>
          </FormikProvider>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
