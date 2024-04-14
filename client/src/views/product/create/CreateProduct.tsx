import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { FC, FormEventHandler, useEffect, useReducer, useState } from "react";
import { createProduct } from "../../../services/productService";
import { PrivateRoutes } from "../../../config/appEnums";
import { toastError } from "../../../utils/toast";
import ProductFormReducer from "../utils/ProductFormReducer";

interface CreateProductProps {}

const CreateProduct: FC<CreateProductProps> = () => {
    const navigate = useNavigate();

    const [form, dispatchForm] = useReducer(ProductFormReducer.formReducer, ProductFormReducer.getInitForm());
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

        createProduct({
            description: form.description.value,
            imageUrl: form.imageUrl.value,
            inventoryCount: form.inventoryCount.value,
            name: form.name.value,
            price: form.price.value,
        })
            .then(() => {
                setSubmitting(false);
                navigate(`${PrivateRoutes.PRODUCT}`);
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
                onBlur={() => dispatchForm({ type: "validateField", payload: "description" })}
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
                onBlur={() => dispatchForm({ type: "validateField", payload: "imageUrl" })}
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
                onBlur={() => dispatchForm({ type: "validateField", payload: "inventoryCount" })}
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
                onBlur={() => dispatchForm({ type: "validateField", payload: "price" })}
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
