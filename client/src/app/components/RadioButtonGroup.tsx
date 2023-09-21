import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React from "react";
import { useAppSelector } from "../store/configureStore";

interface Props {
  options: { value: string; label: string }[];
  onChange: (event: any) => void;
}

const RadioButtonGroup: React.FC<Props> = ({ options, onChange }) => {
  const { productParams } = useAppSelector((state) => state.catalog);

  return (
    <FormControl>
      <FormLabel id="radio-buttons-group-sorting">Sorting</FormLabel>
      <RadioGroup value={productParams.orderBy} onChange={onChange}>
        {options.map((item) => (
          <FormControlLabel
            value={item.value}
            control={<Radio />}
            label={item.label}
            key={item.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export default RadioButtonGroup;
