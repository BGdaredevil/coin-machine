import { FC, FormEvent, useContext, useReducer, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IAction, IForm } from "./types";
import { AuthContext } from "../../../contexts/Auth";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "../../../config/appEnums";
import { toastError } from "../../../utils/toast";
import validators from "../../../utils/validators";
import { EMAIL_PATTERN } from "../../../utils/validatorConstants";

const validationMap: { [x in keyof IForm]: { [x: string]: { value: any; errorMessage: string } } } = {
    email: {
        length: {
            value: 5,
            errorMessage: "Email is too short",
        },
        pattern: {
            value: EMAIL_PATTERN,
            errorMessage: "Email must be valid to mailbox@domain.bg/com",
        },
    },
    password: {
        length: {
            value: 4,
            errorMessage: "Password is too short",
        },
    },
};

const formReducer = (state: IForm, action: IAction): IForm => {
    switch (action.type) {
        case "email": {
            const stateCopy: IForm = {
                ...state,
                email: { ...state.email, value: action.payload!, touched: true, error: false, errorMessage: " " },
            };

            return stateCopy;
        }

        case "password": {
            const stateCopy: IForm = {
                ...state,
                password: { ...state.password, value: action.payload!, touched: true, error: false, errorMessage: " " },
            };

            return stateCopy;
        }

        case "validateField": {
            const stateCopy: IForm = {
                ...state,
                [action.payload]: { ...state[action.payload], touched: true, error: false, errorMessage: " " },
            };

            validators.minLength(
                stateCopy[action.payload],
                validationMap[action.payload].length.errorMessage,
                validationMap[action.payload].length.value
            );

            if (validationMap[action.payload].pattern) {
                validators.isNotPattern(
                    stateCopy[action.payload],
                    validationMap[action.payload].pattern.errorMessage,
                    validationMap[action.payload].pattern.value
                );
            }

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
};

const Login: FC = () => {
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [form, dispatchForm] = useReducer(formReducer, initialForm);

    const [showPass, setShowPass] = useState(false);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (form.email.error || form.password.error) {
            return;
        }

        if (!form.email.touched || !form.password.touched) {
            dispatchForm({ payload: "email", type: "validateField" });
            dispatchForm({ payload: "password", type: "validateField" });
            return;
        }

        login({ email: form.email.value, password: form.password.value })
            .then(() => navigate(`${PublicRoutes.BASE_PATH}`))
            .catch((err) => {
                if (err?.type === "validation") {
                    toastError(err.message);
                    return;
                }

                toastError("Something went wrong");
            });
    };

    return (
        <div>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off" maxWidth={"500px"} margin={"0 auto"}>
                <TextField
                    value={form.email.value}
                    error={form.email.error}
                    helperText={form.email.errorMessage}
                    onChange={(e) => dispatchForm({ payload: e.target.value, type: "email" })}
                    onBlur={() => dispatchForm({ payload: "email", type: "validateField" })}
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
                    onBlur={() => dispatchForm({ payload: "password", type: "validateField" })}
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
                <Button sx={{ marginTop: "16px" }}  type="submit" variant="outlined" color="secondary">
                    submit
                </Button>
            </Box>
        </div>
    );
};

export default Login;
