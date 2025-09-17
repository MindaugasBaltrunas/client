import { useFormik, FormikConfig, FormikValues } from 'formik';
import { createFormikConfig, useFormikConfig } from '../providers/formik/FormikContext';

type FormikConfigWithDefaults<Values extends FormikValues> = 
  Omit<FormikConfig<Values>, 'validateOnBlur' | 'validateOnChange' | 'validateOnMount'> & 
  Partial<Pick<FormikConfig<Values>, 'validateOnBlur' | 'validateOnChange' | 'validateOnMount'>>;

export function useFormikWithDefaults<Values extends FormikValues>(
  config: FormikConfigWithDefaults<Values>
) {
  const formikContext = useFormikConfig();
  const formikConfig = createFormikConfig(config, formikContext);
  
  return useFormik(formikConfig);
}