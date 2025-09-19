import { createContext } from 'react';

export interface FormikContextType {
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnMount: boolean;
  getFieldProps?: (name: string) => any;
}

export const FormikContext = createContext<FormikContextType>({
  validateOnBlur: true,
  validateOnChange: false,
  validateOnMount: false,
});
