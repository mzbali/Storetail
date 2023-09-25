import {
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";

interface CheckBoxButtonsProps {
  checkBoxLabel: string;
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
}

const CheckBoxButtons: React.FC<CheckBoxButtonsProps> = ({
  items,
  checked,
  onChange,
  checkBoxLabel,
}) => {
  const [checkedItems, setCheckedItems] = useState(checked || []);

  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[] = [...checkedItems];
    if (currentIndex === -1) newChecked = [...checkedItems, value];
    else newChecked = newChecked.filter((item) => item !== value);
    setCheckedItems(newChecked);
    onChange(newChecked);
  };
  return (
    <FormGroup>
      <FormLabel>{checkBoxLabel}</FormLabel>
      {items.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.indexOf(item) !== -1}
              onChange={() => {
                handleChecked(item);
              }}
            />
          }
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  );
};

export default CheckBoxButtons;
