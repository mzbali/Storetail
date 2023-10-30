import {Grid, TextField, Typography} from "@mui/material";
import {useFormContext} from "react-hook-form";
import AppTextField from "../../app/components/AppTextField";
import {CardCvcElement, CardExpiryElement, CardNumberElement} from "@stripe/react-stripe-js";
import StripeInput from "./StripeInput";
import {StripeElementType} from "@stripe/stripe-js";

interface PaymentFormProps {
    cardState: { elementError: { [key in StripeElementType]?: string } };
    onChange: (event: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({cardState, onChange}) => {
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
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        InputProps={{
                            inputComponent: StripeInput,
                            inputProps: {
                                component: CardNumberElement
                            }
                        }}
                        error={!!cardState.elementError.cardNumber}
                        helperText={cardState.elementError.cardNumber}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        InputProps={{
                            inputComponent: StripeInput,
                            inputProps: {
                                component: CardExpiryElement
                            }
                        }}
                        error={!!cardState.elementError.cardExpiry}
                        helperText={cardState.elementError.cardExpiry}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="cvv"
                        label="CVV"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="outlined"
                        InputLabelProps={{shrink: true}}
                        InputProps={{
                            inputComponent: StripeInput,
                            inputProps: {
                                component: CardCvcElement
                            }
                        }}
                        error={!!cardState.elementError.cardCvc}
                        helperText={cardState.elementError.cardCvc}
                        onChange={onChange}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentForm;