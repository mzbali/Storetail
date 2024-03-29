import {Container, Divider, Paper, Typography} from "@mui/material";
import React from "react";
import {useLocation} from "react-router-dom";
import {BtnToCatalog} from "../layout/button/BtnToCatalog";

export const ServerError: React.FC = () => {
    const {state}: any = useLocation();
    return (
        <Container component={Paper}>
            {state?.data ? (
                <>
                    <Typography gutterBottom variant="h5" color="red">
                        {state.data.title}
                    </Typography>
                    <Divider/>
                    <Typography>
                        {state.data.detail || "Internal Server Error"}
                    </Typography>
                </>
            ) : (
                <Typography color="red">Server Error</Typography>
            )}
            <BtnToCatalog/>
        </Container>
    );
};
