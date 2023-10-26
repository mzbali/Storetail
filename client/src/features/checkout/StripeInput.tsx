import React, {Ref, useImperativeHandle, useRef} from "react";
import {InputBaseComponentProps} from "@mui/material";

interface StripeComponentProps extends InputBaseComponentProps {
}

const StripeComponent = ({component: Component, ...props}: StripeComponentProps, ref: Ref<unknown>) => {
    const elementRef = useRef<any>();

    useImperativeHandle(ref, () => ({
        focus: () => elementRef.current.focus
    }));

    return (<Component {...props} onReady={(element: any) => elementRef.current = element}/>
    );
};

export default React.forwardRef(StripeComponent);