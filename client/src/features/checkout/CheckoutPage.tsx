import {Box, Button, Paper, Step, StepLabel, Stepper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {validationSchema} from "./checkoutValidation";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import {createOrderAsync} from "./checkoutSlice";
import {OrderValue} from "../../app/models/order";
import agent from "../../app/api/agent";
import {StripeElementType} from "@stripe/stripe-js";
import {CardNumberElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {resetBasket} from "../basket/basketSlice";
import {LoadingButton} from "@mui/lab";

const steps = ["Shipping address", "Review your order", "Payment details"];

const CheckoutPage = () => {
    const [activeStep, setActiveStep] = useState(0);

    const dispatch = useAppDispatch();
    const {orderNumber} = useAppSelector(state => state.orders);
    const {basket} = useAppSelector(state => state.basket);

    const methods = useForm({
        resolver: yupResolver(validationSchema[activeStep]),
        mode: "all",
    });

    const [cardState, setCardState] = useState<{
        elementError: { [key in StripeElementType]?: string }
    }>({elementError: {}});
    const [cardComplete, setCardComplete] =
        useState({cardNumber: false, cardExpiry: false, cardCvc: false});

    const elements = useElements();
    const stripe = useStripe();
    const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>();
    const [paymentMessage, setPaymentMessage] = useState<string>();
    const [loading, setLoading] = useState(false);

    const inputChangeHandler = (event: any) => {
        setCardState(prevState => ({
            ...prevState,
            elementError: {...prevState.elementError, [event.elementType]: event.error?.message}
        }));
        setCardComplete(prevState => ({
            ...prevState, [event.elementType]: event.complete
        }));
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <AddressForm/>;
            case 1:
                return <Review/>;
            case 2:
                return <PaymentForm cardState={cardState} onChange={inputChangeHandler}/>;
            default:
                throw new Error("Unknown step");
        }
    };

    const submitCheckout = async (values: FieldValues) => {
        setLoading(true);
        const {saveAddress, cardName, ...value} = values;
        const valueInput = {shippingAddress: value, saveAddress};
        if (!stripe || !elements) return; // Stripe is not ready yet.
        try {
            const cardElement = elements.getElement(CardNumberElement);
            const result = await stripe.confirmCardPayment(basket!.clientSecret, {
                payment_method: {
                    billing_details: {
                        name: cardName
                    },
                    card: cardElement!
                }
            });
            if (result.paymentIntent?.status === "succeeded") {
                await dispatch(createOrderAsync(valueInput as OrderValue));
                setPaymentSucceeded(true);
                setPaymentMessage("We have Successfully received your payment.");
                setActiveStep(prevState => prevState + 1);
                dispatch(resetBasket());
                setLoading(false);
            } else {
                setPaymentSucceeded(false);
                setPaymentMessage(result.error?.message);
                setActiveStep(activeStep + 1);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            console.log(e);
        }

    };
    const handleNext = async (values: FieldValues) => {
        if (activeStep === steps.length - 1) {
            await submitCheckout(values);
            console.log(values);
        } else
            setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const disableSubmit = () => {
        if (activeStep === steps.length - 1) {
            return !cardComplete.cardNumber
                || !cardComplete.cardExpiry
                || !cardComplete.cardCvc
                || !methods.formState.isValid;
        } else {
            return !methods.formState.isValid;
        }
    };

    useEffect(() => {
        agent.Account.getAddress().then(response => {
            methods.reset({...methods.getValues(), ...response, saveAddress: false});
            console.log(response);
        });
    }, []);


    return (
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {paymentMessage}
                            </Typography>
                            {paymentSucceeded ?
                                <Typography variant="subtitle1">
                                    Your order number is #{orderNumber}. We have not emailed your order
                                    confirmation, and will not send you an update when your order has
                                    shipped, as this is a fake store.
                                </Typography>
                                :
                                <Button variant="contained" onClick={handleBack}>
                                    Go Back And Try Again
                                </Button>}
                        </>
                    ) : (
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}
                            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                        Back
                                    </Button>
                                )}
                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    sx={{mt: 3, ml: 1}}
                                    disabled={disableSubmit()}
                                    loading={loading}
                                >
                                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                                </LoadingButton>
                            </Box>
                        </form>
                    )}
                </>
            </Paper>
        </FormProvider>
    );
};
export default CheckoutPage;
