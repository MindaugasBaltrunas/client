import React from 'react';
import { SelectField } from "./SelectField";
import { useSelectFieldContext } from '../../../app/providers/SelectFieldProvider';

interface SelectOptionsProps {
  options?: any[];
  displayKey?: string;
  styles?: Record<string, string>;
  name?: string;
  value?: string;
  onChange?: (event: React.FormEvent<HTMLSelectElement>) => void;
}

const SelectOptions: React.FC<SelectOptionsProps> = ({
  options,
  displayKey,
  styles,
  name,
  value: externalValue,
  onChange: externalOnChange
}) => {
  const { selectValue, setSelectValue } = useSelectFieldContext();
  
  const currentValue = externalValue !== undefined ? externalValue : selectValue;
  
  const isObjectArray = options && options.length > 0 && typeof options[0] === 'object';
  
  const optionElements = options?.map((option, index) => {
    const value = isObjectArray ? option.id : option;
    const displayText = isObjectArray && displayKey ? option[displayKey] : option;
    return (
      <option value={value} key={index}>
        {displayText}
      </option>
    );
  });

  const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    if (externalOnChange) {
      externalOnChange(event);
    } else {
      setSelectValue(event.currentTarget.value);
    }
  };

  return (
    <SelectField
      value={currentValue}
      name={name || "select"}
      onChange={handleSelectChange}
      style={styles}
    >
      {optionElements}
    </SelectField>
  );
};

export default SelectOptions;