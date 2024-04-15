import { Box, Button, IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FC, FormEvent, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, IForm } from "./types";
import { AuthContext } from "../../../contexts/Auth";
import { PublicRoutes } from "../../../config/appEnums";

const formReducer = (state: IForm, action: IAction): IForm => {
    switch (action.type) {
        case "email": {
            const stateCopy: IForm = { ...state, email: { ...state.email, value: action.payload!, touched: false, error: false } };
            return stateCopy;
        }

        case "password": {
            const stateCopy: IForm = {
                ...state,
                password: { ...state.password, value: action.payload!, touched: false, error: false },
            };
            return stateCopy;
        }

        case "repeatPassword": {
            const stateCopy: IForm = {
                ...state,
                repeatPassword: { ...state.repeatPassword, value: action.payload!, touched: false, error: false },
            };
            return stateCopy;
        }

        default:
            return state;
    }
};

const initialForm = {
    email: {
        value: "",
        error: false,
        touched: false,
        errorMessage: " ",
    },
    password: {
        value: "",
        error: false,
        touched: false,
        errorMessage: " ",
    },
    repeatPassword: {
        value: "",
        error: false,
        touched: false,
        errorMessage: " ",
    },
};

const Register: FC = () => {
    const navigate = useNavigate();

    const { register } = useContext(AuthContext);

    const [form, dispatchForm] = useReducer(formReducer, initialForm);

    const [showPass, setShowPass] = useState(false);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        register({
            email: form.email.value,
            password: form.password.value,
            repeatPassword: form.repeatPassword.value,
        }).then(() => navigate(`${PublicRoutes.BASE_PATH}`));
    };

    return (
        <div>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off" maxWidth={"500px"} margin={"0 auto"}>
                <TextField
                    value={form.email.value}
                    error={form.email.error}
                    helperText={form.email.errorMessage}
                    onChange={(e) => dispatchForm({ payload: e.target.value, type: "email" })}
                    color="secondary"
                    id="email-input"
                    label="Email"
                    placeholder="Email"
                    variant="standard"
                    type="email"
                    fullWidth
                />
                <TextField
                    value={form.password.value}
                    error={form.password.error}
                    helperText={form.password.errorMessage}
                    onChange={(e) => dispatchForm({ payload: e.target.value, type: "password" })}
                    color="secondary"
                    id="password-input"
                    label="Password"
                    placeholder="Password"
                    variant="standard"
                    type={showPass ? "text" : "password"}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowPass((o) => !o)}>
                                {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        ),
                    }}
                />
                <TextField
                    value={form.repeatPassword.value}
                    error={form.repeatPassword.error}
                    helperText={form.repeatPassword.errorMessage}
                    onChange={(e) => dispatchForm({ payload: e.target.value, type: "repeatPassword" })}
                    color="secondary"
                    id="repeat-password-input"
                    label="Repeat Password"
                    placeholder="Repeat Password"
                    variant="standard"
                    type={showPass ? "text" : "password"}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowPass((o) => !o)}>
                                {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        ),
                    }}
                />
                <Button type="submit" variant="outlined" color="secondary">
                    submit
                </Button>
            </Box>
        </div>
    );
};

export default Register;
