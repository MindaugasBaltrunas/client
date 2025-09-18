import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SelectFieldError } from '../../shared/errors/SelectFieldError';

interface SelectFieldContextType {
  selectValue: string;
  setSelectValue: React.Dispatch<React.SetStateAction<string>>;
}

const SelectFieldContext = createContext<SelectFieldContextType | undefined>(undefined);

export const SelectFieldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectValue, setSelectValue] = useState<string>('');

  return (
    <SelectFieldContext.Provider value={{ selectValue, setSelectValue }}>
      {children}
    </SelectFieldContext.Provider>
  );
};

export const useSelectFieldContext = () => {
  const context = useContext(SelectFieldContext);
  if (!context) {
    throw new SelectFieldError('useSelectFieldContext must be used within a SelectFieldProvider');
  }
  return context;
};