import React from "react";
import {Checkbox, FormControlLabel} from "@mui/material";
import {useController, UseControllerProps} from "react-hook-form";

interface AppCheckBoxProps extends UseControllerProps {
    label: string;
}

const AppCheckBox: React.FC<AppCheckBoxProps> = (props) => {
    const {field} = useController({...props, defaultValue: false});
    return (<FormControlLabel
        control={<Checkbox color="secondary" {...field} checked={field.value} disabled={props.disabled}/>}
        label={props.label}
    />);
};

export default AppCheckBox;