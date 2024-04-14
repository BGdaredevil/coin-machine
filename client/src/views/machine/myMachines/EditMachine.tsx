import { FC, ReactNode, useEffect, useReducer, useState } from "react";
import { IMachine } from "../../../utils/commonTypes";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { toastError } from "../../../utils/toast";
import MachineFormReducer from "../utils/MachineFormReducer";
import { updateMachine } from "../../../services/machineService";

interface EditMachineProps {
    machine: IMachine | null;
    dialogTitle: ReactNode;
    open: boolean;
    onClose: Function;
    onSubmit: (data: Pick<IMachine, "name" | "_id">) => void;
    onCancel: Function;
}

const EditMachine: FC<EditMachineProps> = ({ dialogTitle, onCancel, onClose, onSubmit, open, machine }) => {
    const [form, dispatchForm] = useReducer(MachineFormReducer.formReducer, MachineFormReducer.getInitForm());
    const [submitting, setSubmitting] = useState<boolean>(false);

    const cancel = () => {
        if (!machine) {
            dispatchForm({ type: "reset" });
        } else {
            dispatchForm({
                type: "reset",
                payload: { name: machine.name },
            });
        }
        onCancel();
    };

    const close = () => {
        if (!machine) {
            dispatchForm({ type: "reset" });
        } else {
            dispatchForm({
                type: "reset",
                payload: { name: machine.name },
            });
        }
        onClose();
    };

    useEffect(() => {
        if (!open || !machine) {
            return;
        }

        dispatchForm({
            type: "reset",
            payload: { name: machine.name },
        });
    }, [machine, open]);

    useEffect(() => {
        if (!submitting || !machine) {
            return;
        }

        const hasErrror = Object.values(form).some((e) => e.error);

        if (hasErrror) {
            setSubmitting(false);
            return;
        }

        updateMachine(machine._id, { name: form.name.value })
            .then((res) => {
                setSubmitting(false);
                onSubmit({ _id: res._id, name: res.name });
            })
            .catch(() => {
                setSubmitting(false);
                dispatchForm({
                    type: "reset",
                    payload: { name: machine.name },
                });
                toastError("something went wrong");
            });
    }, [form, submitting]);

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent dividers>
                <TextField
                    sx={{ marginBottom: "8px" }}
                    value={form.name.value}
                    error={form.name.error}
                    helperText={form.name.errorMessage}
                    onChange={(e) => dispatchForm({ payload: e.target.value, type: "name" })}
                    onBlur={() => dispatchForm({ type: "validateField", payload: "name" })}
                    variant="standard"
                    color="secondary"
                    id="name-input"
                    label="Product Name"
                    placeholder="Product Name"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel}>Cancel</Button>
                <Button
                    onClick={() => {
                        dispatchForm({ type: "validateAll" });
                        setSubmitting(true);
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMachine;
