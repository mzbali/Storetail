import {Grid, Typography} from "@mui/material";
import AppTextField from "../../app/components/AppTextField";
import {useFormContext} from "react-hook-form";
import AppCheckBox from "../../app/components/AppCheckBox";

const AddressForm = () => {
    const {control, formState} = useFormContext();
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <AppTextField label="Full Name" name="fullName" control={control}/>
                </Grid>
                <Grid item xs={12}>
                    <AppTextField label="Address Line 1" name="address1" control={control}/>
                </Grid>
                <Grid item xs={12}>
                    <AppTextField label="Address Line 2" name="address2" control={control}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextField label="City" name="city" control={control}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextField label="Zip" name="zip" control={control}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextField label="State" name="state" control={control}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextField label="Country" name="country" control={control}/>
                </Grid>
                <Grid item xs={12}>
                    <AppCheckBox label="Save this Address" name="saveAddress" disabled={!formState.isDirty}/>
                </Grid>
            </Grid>
        </>
    );
};

export default AddressForm;