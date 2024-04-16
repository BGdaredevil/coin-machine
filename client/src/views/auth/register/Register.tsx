import { Box, Button, IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FC, FormEvent, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAction, IForm } from "./types";
import { AuthContext } from "../../../contexts/Auth";
import { PublicRoutes } from "../../../config/appEnums";
import { toastError } from "../../../utils/toast";
import { EMAIL_PATTERN } from "../../../utils/validatorConstants";
import validators from "../../../utils/validators";

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
    repeatPassword: {
        length: {
            value: 4,
            errorMessage: "Repeat Password is too short",
        },
        equals: {
            value: "password" as const,
            errorMessage: "Repeat Password must match Password",
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

        case "repeatPassword": {
            const stateCopy: IForm = {
                ...state,
                repeatPassword: { ...state.repeatPassword, value: action.payload!, touched: true, error: false, errorMessage: " " },
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

            if (validationMap[action.payload].pattern && stateCopy[action.payload].value.length) {
                validators.isNotPattern(
                    stateCopy[action.payload],
                    validationMap[action.payload].pattern.errorMessage,
                    validationMap[action.payload].pattern.value
                );
            }

            if (validationMap[action.payload].equals) {
                stateCopy[action.payload].error = stateCopy[action.payload].value === stateCopy.password.value;

                if (stateCopy[action.payload].error) {
                    stateCopy[action.payload].errorMessage = validationMap.repeatPassword.equals.errorMessage;
                }
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

        if (form.email.error || form.password.error || form.repeatPassword.error) {
            return;
        }

        if (!form.email.touched || !form.password.touched || form.repeatPassword.touched) {
            dispatchForm({ payload: "email", type: "validateField" });
            dispatchForm({ payload: "password", type: "validateField" });
            dispatchForm({ payload: "repeatPassword", type: "validateField" });

            return;
        }

        register({
            email: form.email.value,
            password: form.password.value,
            repeatPassword: form.repeatPassword.value,
        })
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
                <TextField
                    value={form.repeatPassword.value}
                    error={form.repeatPassword.error}
                    helperText={form.repeatPassword.errorMessage}
                    onChange={(e) => dispatchForm({ payload: e.target.value, type: "repeatPassword" })}
                    onBlur={() => dispatchForm({ payload: "repeatPassword", type: "validateField" })}
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
                <Button sx={{ marginTop: "16px" }} type="submit" variant="outlined" color="secondary">
                    submit
                </Button>
            </Box>
        </div>
    );
};

export default Register;
