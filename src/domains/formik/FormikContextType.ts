import { ReactNode } from "react";
import { FormikContextType } from "../../app/providers/formik/FormikContext";

export interface FormikProviderProps {
  children: ReactNode;
  config?: Partial<FormikContextType>;
}