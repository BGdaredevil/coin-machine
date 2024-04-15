import { FC, ReactNode, useEffect, useReducer, useState } from "react";
import { IApiProduct, IProuduct } from "../../../utils/commonTypes";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ProductFormReducer from "../utils/ProductFormReducer";
import { updateProduct } from "../../../services/productService";
import { toastError } from "../../../utils/toast";

interface EditProductProps {
    product: IApiProduct | null;
    dialogTitle: ReactNode;
    open: boolean;
    onClose: Function;
    onSubmit: (data: IApiProduct) => void;
    onCancel: Function;
}

const EditProduct: FC<EditProductProps> = ({ dialogTitle, onCancel, onClose, onSubmit, open, product }) => {
    const [form, dispatchForm] = useReducer(ProductFormReducer.formReducer, ProductFormReducer.getInitForm());

    const [submitting, setSubmitting] = useState<boolean>(false);

    const cancel = () => {
        if (!product) {
            dispatchForm({ type: "reset" });
        } else {
            dispatchForm({
                type: "reset",
                payload: {
                    id: product._id,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    name: product.name,
                    price: product.price,
                } as IProuduct,
            });
        }
        onCancel();
    };

    const close = () => {
        if (!product) {
            dispatchForm({ type: "reset" });
        } else {
            dispatchForm({
                type: "reset",
                payload: {
                    id: product._id,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    name: product.name,
                    price: product.price,
                } as IProuduct,
            });
        }
        onClose();
    };

    useEffect(() => {
        if (!open || !product) {
            return;
        }

        dispatchForm({
            type: "reset",
            payload: {
                id: product._id,
                description: product.description,
                imageUrl: product.imageUrl,
                name: product.name,
                price: product.price,
            } as IProuduct,
        });
    }, [product, open]);

    useEffect(() => {
        if (!submitting || !product) {
            return;
        }

        const hasErrror = Object.values(form).some((e) => e.error);

        if (hasErrror) {
            setSubmitting(false);
            return;
        }

        updateProduct({
            id: product._id,
            description: form.description.value,
            imageUrl: form.imageUrl.value,
            name: form.name.value,
            price: form.price.value,
        })
            .then((res) => {
                setSubmitting(false);
                onSubmit(res);
            })
            .catch(() => {
                setSubmitting(false);
                dispatchForm({
                    type: "reset",
                    payload: {
                        id: product._id,
                        description: product.description,
                        imageUrl: product.imageUrl,
                        name: product.name,
                        price: product.price,
                    } as IProuduct,
                });
                toastError("something went wrong");
            });
    }, [form, submitting]);

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent
                dividers
                // sx={{ paddingBottom: 0 }}
            >
                <TextField
                    value={form.name.value}
                    error={form.name.error}
                    helperText={form.name.errorMessage || " "}
                    sx={{ marginBottom: "8px" }}
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
                    helperText={form.description.errorMessage || " "}
                    sx={{ marginBottom: "8px" }}
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
                    helperText={form.imageUrl.errorMessage || " "}
                    sx={{ marginBottom: "8px" }}
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
                    value={form.price.value}
                    error={form.price.error}
                    helperText={form.price.errorMessage || " "}
                    sx={{ marginBottom: "8px" }}
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
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={cancel}>
                    Cancel
                </Button>
                <Button
                    color="secondary"
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

export default EditProduct;
