import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {Link, useNavigate} from "react-router-dom";
import {Paper} from "@mui/material";
import agent from "../../app/api/agent";
import {FieldValues, useForm} from "react-hook-form";
import {LoadingButton} from "@mui/lab";
import {toast} from "react-toastify";

const Register = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: {isSubmitting, errors, isValid}
    } = useForm({mode: "all"});
    const navigate = useNavigate();

    const handleApiErrors = (errors: string[]) => {
        console.log(errors);
        if (errors) {
            errors.forEach(error => {
                if (error.includes("Name")) {
                    setError("name", {message: error});
                } else if (error.includes("Email")) {
                    setError("email", {message: error});
                } else if (error.includes("Password")) {
                    setError("password", {message: error});
                }
            });
        }
    };

    const submitForm = (data: FieldValues) => {
        agent.Account.register(data)
            .then(() => {
                toast.success("Registration successful - you can now login ");
                navigate("/login");
            })
            .catch(errors => {
                handleApiErrors(errors);
            });
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
                Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    autoFocus
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^([\w\-.]+)@(([\w\-]{1,67})|([\w\-]+\.[\w\-]{1,67}))\.(([a-zA-Z\d]{2,4})(\.[a-zA-Z\d]{2})?)$/,
                            message: "Email is invalid format."
                        }
                    })}
                    error={!!errors?.email}
                    helperText={errors.email?.message ? errors.email.message.toString() : ""}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    {...register("name", {required: "Username is required"})}
                    error={!!errors?.name}
                    helperText={errors.name?.message ? errors.name.message.toString() : ""}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{quot:'?/g.l,])(?!.*\s).*$/,
                            message: "Password does not meet the complexity requirement."
                        }
                    })}
                    error={!!errors?.password}
                    helperText={errors.password?.message ? errors.password.message.toString() : ""}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    loading={isSubmitting}
                    disabled={!isValid}
                >
                    Sign Up
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/login">
                            {"Have an account? Login"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Register;