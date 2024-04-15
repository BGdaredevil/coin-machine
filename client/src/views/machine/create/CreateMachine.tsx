import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { FC, FormEventHandler, useEffect, useReducer, useState } from "react";
import { PrivateRoutes } from "../../../config/appEnums";
import { toastError } from "../../../utils/toast";
import MachineFormReducer from "../utils/MachineFormReducer";
import { createMachine } from "../../../services/machineService";

const CreateMachine: FC = () => {
    const navigate = useNavigate();

    const [form, dispatchForm] = useReducer(MachineFormReducer.formReducer, MachineFormReducer.getInitForm());
    const [submitting, setSubmitting] = useState<boolean>(false);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        dispatchForm({ type: "validateAll" });
        setSubmitting(true);
    };

    useEffect(() => {
        if (!submitting) {
            return;
        }

        const hasErrror = Object.values(form).some((e) => e.error);

        if (hasErrror) {
            setSubmitting(false);
            return;
        }

        createMachine({ name: form.name.value })
            .then(() => {
                setSubmitting(false);
                navigate(`${PrivateRoutes.MACHINE}`);
            })
            .catch(() => {
                setSubmitting(false);
                dispatchForm({ type: "reset" });
                toastError("something went wrong");
            });
    }, [submitting, form]);

    return (
        <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off" maxWidth={"500px"} margin={"0 auto"}>
            <TextField
                value={form.name.value}
                error={form.name.error}
                helperText={form.name.errorMessage}
                onChange={(e) => dispatchForm({ payload: e.target.value, type: "name" })}
                onBlur={() => dispatchForm({ type: "validateField", payload: "name" })}
                variant="standard"
                color="secondary"
                id="name-input"
                label="Machine Name"
                placeholder="Machine Name"
                type="text"
                fullWidth
            />
            <Button sx={{ marginTop: "16px" }} color="secondary" type="submit" variant="outlined">
                submit
            </Button>
        </Box>
    );
};

export default CreateMachine;
