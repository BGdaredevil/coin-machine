import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { FC, FormEventHandler, useEffect, useReducer, useState } from "react";
import { IAction, IForm } from "./types";
import validators from "../../../utils/validators";
import { createProduct } from "../../../services/productService";
import { PrivateRoutes } from "../../../config/appEnums";
import { toastError } from "../../../utils/toast";
import { URL_PATTERN } from "../../../utils/validatorConstants";

interface CreateProductProps {}

const initialForm: IForm = {
    name: {
        value: "",
        error: false,
        touched: false,
        errorMessage: "",
    },
    description: {
        value: "",
        error: false,
        touched: false,
        errorMessage: "",
    },
    imageUrl: {
        value: "",
        error: false,
        touched: false,
        errorMessage: "",
    },
    inventoryCount: {
        value: 0,
        error: false,
        touched: false,
        errorMessage: "",
    },
    price: {
        value: 0,
        error: false,
        touched: false,
        errorMessage: "",
    },
};

const formReducer = (state: IForm, action: IAction): IForm => {
    switch (action.type) {
        case "name": {
            const nextFieldState: IForm["name"] = { ...state.name, error: false, errorMessage: "" };

            nextFieldState.value = action.payload!;

            return { ...state, name: nextFieldState };
        }

        case "description": {
            const nextFieldState: IForm["description"] = { ...state.description, error: false, errorMessage: "" };

            nextFieldState.value = action.payload!;

            return { ...state, description: nextFieldState };
        }

        case "imageUrl": {
            const nextFieldState: IForm["imageUrl"] = { ...state.imageUrl, error: false, errorMessage: "" };

            nextFieldState.value = action.payload!;

            return { ...state, imageUrl: nextFieldState };
        }

        case "price": {
            const nextFieldState: IForm["price"] = { ...state.price, error: false, errorMessage: "" };

            nextFieldState.value = Number(action.payload!);

            return { ...state, price: nextFieldState };
        }

        case "inventoryCount": {
            const nextFieldState: IForm["inventoryCount"] = { ...state.inventoryCount, error: false, errorMessage: "" };

            nextFieldState.value = Number(action.payload!);

            return { ...state, inventoryCount: nextFieldState };
        }

        case "validate": {
            const nextState = { ...state };

            validators.required(nextState.name, "Name is required");
            validators.minLength(nextState.name, "Name is too short", 2);
            validators.required(nextState.description, "Description is required");
            validators.minLength(nextState.description, "Description is too short", 10);
            validators.required(nextState.imageUrl, "Image URL is required");
            validators.isNotPattern(nextState.imageUrl, "Please enter a valid URL", URL_PATTERN);
            validators.required(nextState.price, "Price is required");
            validators.min(nextState.price, "Price should be a positive number", 0);
            validators.required(nextState.inventoryCount, "Inventory Count is required");
            validators.min(nextState.inventoryCount, "Inventory Count should be a positive number", 0);

            return nextState;
        }

        case "reset": {
            const blankStrField = { value: "", error: false, touched: false, errorMessage: "" };
            const blankNumberField = { value: 0, error: false, touched: false, errorMessage: "" };

            return {
                description: { ...blankStrField },
                imageUrl: { ...blankStrField },
                inventoryCount: { ...blankNumberField },
                name: { ...blankStrField },
                price: { ...blankNumberField },
            };
        }

        default:
            return state;
    }
};

const CreateProduct: FC<CreateProductProps> = () => {
    const navigate = useNavigate();

    const [form, dispatchForm] = useReducer(formReducer, initialForm);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        dispatchForm({ type: "validate" });
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

        createProduct({
            description: form.description.value,
            imageUrl: form.imageUrl.value,
            inventoryCount: form.inventoryCount.value,
            name: form.name.value,
            price: form.price.value,
        })
            .then(() => navigate(`${PrivateRoutes.ADMIN}${PrivateRoutes.PRODUCT}`))
            .catch(() => {
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
                onBlur={() => dispatchForm({ type: "validate" })}
                variant="standard"
                color="secondary"
                id="name-input"
                label="Product Name"
                placeholder="Product Name"
                type="text"
                fullWidth
            />
            <TextField
                value={form.description.value}
                error={form.description.error}
                helperText={form.description.errorMessage}
                onChange={(e) => dispatchForm({ payload: e.target.value, type: "description" })}
                onBlur={() => dispatchForm({ type: "validate" })}
                variant="standard"
                color="secondary"
                id="description-input"
                label="Product Description"
                placeholder="Product Description"
                type="text"
                fullWidth
            />
            <TextField
                value={form.imageUrl.value}
                error={form.imageUrl.error}
                helperText={form.imageUrl.errorMessage}
                onChange={(e) => dispatchForm({ payload: e.target.value, type: "imageUrl" })}
                onBlur={() => dispatchForm({ type: "validate" })}
                variant="standard"
                color="secondary"
                id="image-input"
                label="Product Image"
                placeholder="Product Image"
                type="text"
                fullWidth
            />
            <TextField
                value={form.inventoryCount.value}
                error={form.inventoryCount.error}
                helperText={form.inventoryCount.errorMessage}
                onChange={(e) => dispatchForm({ payload: e.target.value, type: "inventoryCount" })}
                onBlur={() => dispatchForm({ type: "validate" })}
                variant="standard"
                color="secondary"
                id="inventory-count-input"
                label="Inventory Count"
                placeholder="Inventory Count"
                type="number"
                inputProps={{ step: 1, min: 0 }}
                fullWidth
            />
            <TextField
                value={form.price.value}
                error={form.price.error}
                helperText={form.price.errorMessage}
                onChange={(e) => dispatchForm({ payload: e.target.value, type: "price" })}
                onBlur={() => dispatchForm({ type: "validate" })}
                variant="standard"
                color="secondary"
                id="price-input"
                label="Price"
                placeholder="Price"
                type="number"
                inputProps={{ step: 0.01, min: 0 }}
                fullWidth
            />
            <Button type="submit" variant="outlined">
                submit
            </Button>
        </Box>
    );
};

export default CreateProduct;
