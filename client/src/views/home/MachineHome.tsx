import { Autocomplete, Box, Button, Card, CardActions, CardContent, CardMedia, FormControl, TextField, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { IApiProduct, IItemAutoselect, IMachine } from "../../utils/commonTypes";
import { useSearchParams } from "react-router-dom";
import { MACHINE_KEY } from "../../config/appConstants";
import { getMachine, getPublicMachines } from "../../services/machineService";
import PurchaseDialog from "./PurchaseDialog/PurchaseDialog";
import { isCancelledErrorProcessor } from "../../services/apiService";

interface MachineHomeProps {}

const MachineHome: FC<MachineHomeProps> = () => {
    const [params, setParams] = useSearchParams();
    const machineId = params.get(MACHINE_KEY);

    const [machines, setMachines] = useState<IItemAutoselect[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<IItemAutoselect | null>(null);
    const [activeMachine, setActiveMachine] = useState<Omit<IMachine, "owner"> | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<{ inventoryCount: number; item: IApiProduct } | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        if (!machineId) {
            setSelectedMachine(null);
            setActiveMachine(null);
            return;
        }

        const controller = new AbortController();

        getMachine(machineId, { signal: controller.signal })
            .then((res) => {
                // setCurrent(res);
                setSelectedMachine({ _id: res._id, name: res.name });
                setActiveMachine(res);
            })
            .catch(isCancelledErrorProcessor);

        return () => controller.abort();
    }, [machineId]);

    useEffect(() => {
        const controller = new AbortController();

        getPublicMachines({ signal: controller.signal })
            .then((res) => {
                setMachines(res);
            })
            .catch(isCancelledErrorProcessor);

        return () => controller.abort();
    }, []);

    return (
        <Box>
            <Box display={"flex"} alignItems={"center"} gap="20px">
                <Autocomplete
                    fullWidth
                    blurOnSelect
                    value={selectedMachine}
                    options={machines}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    onChange={(_event, newValue) => {
                        setSelectedMachine(newValue);

                        if (newValue) {
                            params.set(MACHINE_KEY, newValue._id);
                            setParams(params);
                            return;
                        }

                        params.delete(MACHINE_KEY);
                        setParams(params);
                    }}
                    getOptionKey={(opt) => opt._id}
                    getOptionLabel={(option) => option.name || " "}
                    renderInput={(params) => (
                        <FormControl fullWidth sx={{ marginTop: 0 }}>
                            <TextField
                                {...params}
                                label={"Select Machine"}
                                placeholder={"Select Machine"}
                                variant={"standard"}
                                required
                                error={false}
                                helperText={" "}
                            />
                        </FormControl>
                    )}
                />
            </Box>
            {activeMachine && selectedProduct && (
                <PurchaseDialog
                    open={openModal}
                    machine={activeMachine}
                    productInfo={selectedProduct}
                    onCancel={() => {
                        setOpenModal(false);
                        setSelectedProduct(null);
                    }}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedProduct(null);
                    }}
                    onSubmit={(data) => {
                        setActiveMachine(data);
                        setOpenModal(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
            <Box style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {activeMachine?.inventory.map(({ inventoryCount, item: product }) => (
                    <div key={product._id}>
                        <Card sx={{ width: "280px", margin: "10px", boxSizing: "border-box" }}>
                            <CardMedia
                                component="img"
                                src={product.imageUrl}
                                alt="Product-image"
                                sx={{ objectFit: "cover", height: "200px" }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>

                                <Typography gutterBottom variant="body1" component="div">
                                    {inventoryCount ? `${inventoryCount} available at ${product.price} EUR/pcs` : "OUT OF STOCK"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    sx={{ marginLeft: "auto" }}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        setSelectedProduct({ inventoryCount, item: product });
                                        setOpenModal(true);
                                    }}
                                >
                                    Purchase
                                </Button>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </Box>
        </Box>
    );
};

export default MachineHome;
