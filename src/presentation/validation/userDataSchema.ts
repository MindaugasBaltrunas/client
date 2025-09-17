import * as Yup from 'yup';
import { SenderData } from "../../domains/sender/sender";

export const userDataSchema = Yup.object<SenderData>({
   
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),
    
    phone: Yup.string()
        .matches(
            /^[\+]?[1-9][\d]{0,15}$/,
            'Please enter a valid phone number'
        )
        .required('Phone number is required'),
    
    address: Yup.string()
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address must be less than 200 characters')
        .required('Address is required'),
});