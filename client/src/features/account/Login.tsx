import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Paper} from "@mui/material";
import {FieldValues, useForm} from "react-hook-form";
import {LoadingButton} from "@mui/lab";
import {loginUserAsync} from "./accountSlice";
import {useAppDispatch} from "../../app/store/configureStore";

const Login = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {isSubmitting, errors, isValid}
    } = useForm({mode: "all"});
    const submitForm = async (data: FieldValues) => {
        try {
            await dispatch(loginUserAsync(data));
            navigate(location.state?.from.pathname || "/catalog");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container component={Paper} maxWidth="xs" sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3
        }}>

            <Avatar sx={{m: 1, backgroundColor: "secondary.main"}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{mt: 1}}>
                <TextField
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register("name", {required: "Username is required."})}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message ? errors.name.message.toString() : ""}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password", {required: "Password is required."})}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message ? errors.password.message.toString() : ""}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />
                <LoadingButton
                    loading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Sign In
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/register">
                            {"Don't have an account? Register"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Login;