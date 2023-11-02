import React from "react";
import Carousel from "nuka-carousel";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {Box, Button, Typography} from "@mui/material";

const images = ["hero1", "hero2", "hero3"];

export const HomePage: React.FC = () => {
    return (<>
            <Carousel wrapAround
                      renderCenterLeftControls={({previousSlide}) => (
                          <Button onClick={previousSlide}>
                              <ArrowBackIosNewRoundedIcon/>
                          </Button>
                      )} renderCenterRightControls={({nextSlide}) => (
                <Button onClick={nextSlide}>
                    <ArrowForwardIosIcon/>
                </Button>
            )}>
                {images.map(image => (
                    <img key={image} src={`/images/${image}.jpg`} alt={image}
                         style={{display: "block", width: "100%", maxHeight: 700}}/>)
                )}
            </Carousel>
            <Box sx={{pb: 4}} display="flex" flexDirection="column" justifyContent="center" alignItems="center">

                <Typography variant="h1">Welcome to the store</Typography>
            </Box>
        </>
    );
};
