import React, {useEffect, useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import agent from "../../app/api/agent";
import {useAppDispatch} from "../../app/store/configureStore";
import {setBasket} from "../basket/basketSlice";

const stripePromise = loadStripe("pk_test_51O5AeSGFpGYt90MYUyyKQUVc1FVKhvsMV4NubxURdFNDt2xcAeZo5UjsmxC7aJplFOs8fFb77iXpWiF7VAZgxt5U00htL3Sp1x");
const CheckoutWrapper: React.FC = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payment.createOrderIntent()
            .then(result => {
                dispatch(setBasket(result));
                console.log(result);
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    );
};

export default CheckoutWrapper;