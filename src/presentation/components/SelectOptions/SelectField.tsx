import { ErrorMessage, useField } from 'formik';
import { useEffect } from 'react';
import { HTMLProps } from 'react';

interface PropsType extends HTMLProps<HTMLSelectElement> {
    name: string;
    className?: string;
}

export const SelectField = ({ label, value, ...props }: PropsType) => {
    const [field, , getFieldProps] = useField(props);

    useEffect(() => {
        getFieldProps.setValue(value);
    }, [getFieldProps, value]);

    return (
        <>
            <select {...field} {...props} value={value} />
            <div style={{
                color: "red",
                fontSize: '11px'
            }}>
                <ErrorMessage component="div" name={field?.name} />
            </div >
        </>
    );
};