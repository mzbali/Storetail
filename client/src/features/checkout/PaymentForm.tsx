import {Checkbox, FormControlLabel, Grid, TextField, Typography} from "@mui/material";
import {useFormContext} from "react-hook-form";
import AppTextField from "../../app/components/AppTextField";

const PaymentForm = () => {
    const {control} = useFormContext();
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <AppTextField
                        name="cardName"
                        label="Name on card"
                        control={control}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="cardNumber"
                        label="Card number"
                        fullWidth
                        autoComplete="cc-number"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="cvv"
                        label="CVV"
                        helperText="Last three digits on signature strip"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox color="secondary" name="saveCard" value="yes"/>}
                        label="Remember credit card details for next time"
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentForm;