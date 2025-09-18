import React from 'react';
import { SelectField } from "./SelectField";
import { useSelectFieldContext } from '../../../app/providers/selectFieldProvider';

interface SelectOptionsProps {
  options?: any[];
  displayKey?: string;
  styles?: Record<string, string>;
  name?: string;
}

const SelectOptions: React.FC<SelectOptionsProps> = ({
  options,
  displayKey,
  styles,
  name
}) => {
  const { selectValue, setSelectValue } = useSelectFieldContext();
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
    setSelectValue(event.currentTarget.value);
  };

  return (
    <SelectField
      value={selectValue}
      name={name || "select"}
      onChange={handleSelectChange}
      style={styles}
    >
      {optionElements}
    </SelectField>
  );
};

export default SelectOptions;