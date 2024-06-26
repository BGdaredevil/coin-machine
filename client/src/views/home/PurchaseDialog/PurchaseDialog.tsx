import { FC, useReducer } from "react";
import { IApiProduct, IMachine } from "../../../utils/commonTypes";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReplayIcon from "@mui/icons-material/Replay";
import coinReducer from "./coinReducer";
import { coinIterationHelper } from "./typesUtils";
import { toastError, toastSuccess, toastWarning } from "../../../utils/toast";
import { purchaseProduct } from "../../../services/machineService";

interface PurchaseDialogProps {
    machine: Omit<IMachine, "owner">;
    productInfo: { inventoryCount: number; item: IApiProduct };
    open: boolean;
    onClose: VoidFunction;
    onCancel: VoidFunction;
    onSubmit: (data: any) => void;
}

const PurchaseDialog: FC<PurchaseDialogProps> = ({
    machine,
    productInfo: { inventoryCount, item: product },
    open,
    onClose,
    onCancel,
    onSubmit,
}) => {
    const [form, dispatchForm] = useReducer(coinReducer.coinReducer, coinReducer.initialState, (state) => {
        return {
            ...state,
            productPrice: product.price,
            productQuantity: 1,
            total: product.price,
        };
    });

    const close = () => {
        onClose();
    };
    const cancel = () => {
        onCancel();
    };
    const confirm = () => {
        const remaining = form.total - form.insertedValue;

        if (remaining > 0) {
            toastWarning(`Please insert an additional ${(Math.round(remaining * 100) / 100).toFixed(2)} EUR`);
            return;
        }

        if (form.productQuantity == 0) {
            toastWarning(`Please select product quantity`);
            return;
        }

        if (form.productQuantity > inventoryCount) {
            toastWarning(`Only ${inventoryCount} pcs are available`);
            return;
        }

        const purchaseResult = coinReducer.getChangeCoins(machine, form);

        if (!purchaseResult.canReturnAllChange) {
            toastWarning(
                `sorry, the machine does not have enough coins to return  ${purchaseResult.missingFunds} EUR in change. Returning all user coins`
            );
            dispatchForm({
                type: "reset",
                payload: {
                    productPrice: product.price,
                    productQuantity: 1,
                    total: product.price,
                },
            });

            return;
        }

        purchaseProduct(machine._id, product._id, {
            qty: form.productQuantity,
            userAddedCoins: {
                twoDCoin: form.twoDCoin,
                oneDCoin: form.oneDCoin,
                fiftyCCoin: form.fiftyCCoin,
                twentyCCoin: form.twentyCCoin,
                tenCCoin: form.tenCCoin,
                fiveCCoin: form.fiveCCoin,
                twoCCoin: form.twoCCoin,
                oneCCoin: form.oneCCoin,
            },
        })
            .then((res) => {
                toastSuccess(
                    <>
                        <Typography variant="body1" color="text.secondary" sx={{ color: "inherit" }}>
                            {`Thank you for your purchase!${purchaseResult.neededCoins.length ? " Your change is:" : ""}`}
                        </Typography>
                        {purchaseResult.neededCoins.map((e) => (
                            <Typography key={`${e.coin}x${e.count}`} variant="body2" color="text.secondary" sx={{ color: "inherit" }}>
                                {`${e.coin} EUR x ${e.count}`}
                            </Typography>
                        ))}
                    </>
                );
                const updatedMachine = { ...res, owner: res.owner._id };
                onSubmit(updatedMachine);
            })
            .catch((err) => {
                switch (err.type) {
                    case "no-such-product":
                    case "no-inventory":
                    case "no-enough-paid":
                    case "no-enough-coins":
                        toastError(err.message);
                        return;

                    default:
                        throw err;
                }
            });

        return;
    };

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="md">
            <DialogTitle>Purchase {product.name}</DialogTitle>
            <DialogContent dividers>
                <Grid container>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ boxSizing: "border-box" }}>
                            <CardMedia
                                component="img"
                                src={product.imageUrl}
                                alt="Product-image"
                                sx={{ objectFit: "cover", maxHeight: "250px" }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="div">
                                    {inventoryCount} available at {product.price} EUR/pcs
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Box marginLeft={"8px"}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box sx={{ flexGrow: 1, maxWidth: "80px" }}>
                                    <Typography variant="body1">{form.productQuantity}</Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1">to purchase: {form.productQuantity} pcs</Typography>
                                </Box>
                                <Box>
                                    <IconButton
                                        onClick={() => dispatchForm({ type: "setProductQuantity", payload: form.productQuantity + 1 })}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton
                                        disabled={form.productQuantity - 1 < 0}
                                        onClick={() => dispatchForm({ type: "setProductQuantity", payload: form.productQuantity - 1 })}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            {coinIterationHelper.map((coin) => {
                                return (
                                    <Box key={coin.field} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box sx={{ flexGrow: 1, maxWidth: "80px" }}>
                                            <Typography variant="body1">{coin.value}</Typography>
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1">inserted: {form[coin.field]} coins</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton
                                                onClick={() =>
                                                    dispatchForm({
                                                        type: "setCoin",
                                                        payload: { field: coin.field, count: form[coin.field] + 1 },
                                                    })
                                                }
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton
                                                disabled={form[coin.field] - 1 < 0}
                                                onClick={() =>
                                                    dispatchForm({
                                                        type: "setCoin",
                                                        payload: { field: coin.field, count: form[coin.field] - 1 },
                                                    })
                                                }
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                );
                            })}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1">total: {form.total.toFixed(2)} EUR</Typography>
                                    <Typography variant="body1">
                                        remaining: {(Math.round((form.total - form.insertedValue) * 100) / 100).toFixed(2)} EUR
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() =>
                                        dispatchForm({
                                            type: "reset",
                                            payload: {
                                                productPrice: product.price,
                                                productQuantity: 1,
                                                total: product.price,
                                            },
                                        })
                                    }
                                >
                                    <ReplayIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={cancel}>
                    Cancel
                </Button>
                <Button color="secondary" onClick={confirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PurchaseDialog;
