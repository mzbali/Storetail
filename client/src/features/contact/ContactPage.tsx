import {Button, ButtonGroup, Typography} from "@mui/material";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import {decrement, increment} from "./counterReducer";
import {fetchCurrentUser} from "../account/accountSlice";

interface ContactPageProps {
}

export const ContactPage: React.FC<ContactPageProps> = ({}) => {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state) => state.account);
    const counter = useAppSelector((state) => state.counter);

    return (
        <>
            <Typography variant="h3">Contact Page</Typography>
            <Typography variant="h5">{counter.count}</Typography>
            <ButtonGroup>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(increment(1))}
                >
                    Increment
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => dispatch(decrement(1))}
                >
                    Decrement
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => dispatch(increment(5))}
                >
                    Increase +5
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(fetchCurrentUser())}
                >
                    currentUser {user ? user.email : "None"}
                </Button>
            </ButtonGroup>
        </>
    );
};
