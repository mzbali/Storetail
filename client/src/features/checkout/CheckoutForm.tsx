import React from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe("pk_test_51O5AeSGFpGYt90MYUyyKQUVc1FVKhvsMV4NubxURdFNDt2xcAeZo5UjsmxC7aJplFOs8fFb77iXpWiF7VAZgxt5U00htL3Sp1x");
const CheckoutForm: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    );
};

export default CheckoutForm;