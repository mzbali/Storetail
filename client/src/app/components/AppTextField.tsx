import React from "react";
import {useController, UseControllerProps} from "react-hook-form";
import {TextField} from "@mui/material";

interface AppTextFieldProps extends UseControllerProps {
    label: string;
}

const AppTextField: React.FC<AppTextFieldProps> = (props) => {
    const {field, fieldState} = useController({...props, defaultValue: ""});
    return <TextField variant="outlined"
                      {...props}
                      {...field}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth/>;

};

export default AppTextField;