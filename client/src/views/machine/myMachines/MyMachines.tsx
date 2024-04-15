import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    Chip,
    FormControl,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    addProducts,
    editMachineProducts,
    getMachine,
    getMyMachines,
    getNotAssignedProducts,
    refillCoins,
} from "../../../services/machineService";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toastError, toastSuccess } from "../../../utils/toast";
import { IItemAutoselect, IMachine } from "../../../utils/commonTypes";
import EditMachine from "./EditMachine";
import { MACHINE_KEY } from "../../../config/appConstants";
import { coinIterationHelper } from "../../home/PurchaseDialog/typesUtils";
import { isCancelledErrorProcessor } from "../../../services/apiService";

const MyMachines: FC = () => {
    const [params, setParams] = useSearchParams();
    const machineId = params.get(MACHINE_KEY);

    const [autocompleteValue, setAutocompleteValue] = useState<IItemAutoselect | null>(null);
    const [current, setCurrent] = useState<IMachine | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [options, setOptions] = useState<IItemAutoselect[]>([]);
    const [products, setProducts] = useState<IItemAutoselect[]>([]);
    const [productsToAdd, setProductsToAdd] = useState<IItemAutoselect[]>([]);
    const [productsToRemove, setProductsToRemove] = useState<IItemAutoselect[]>([]);
    const [inventories, setInventories] = useState<{ [x: string]: number }>({});

    const addProductsHandle = () => {
        if (!machineId) {
            toastError("please select a machine first");
            return;
        }

        addProducts(machineId, { productsToAdd: productsToAdd.map((e) => e._id) }).then((res: IMachine) => {
            // console.log(res);
            setProductsToAdd([]);
            setProducts((prev) => {
                const ids = res.inventory.map((e) => e.item._id);

                return [...prev].filter((e) => !ids.includes(e._id));
            });
            toastSuccess("Products Added");
            setCurrent(res);
        });
    };

    const handleRemove = (item: IItemAutoselect, toBeRemoved: boolean) => {
        if (toBeRemoved) {
            setProductsToRemove((prev) => [...prev].filter((e) => e._id !== item._id));
            return;
        }

        setProductsToRemove((prev) => [...prev, item]);
    };

    const handleConfirm = () => {
        if (!machineId) {
            toastError("please select a machine first");
            return;
        }

        editMachineProducts(machineId, { inventoryChanges: inventories, productsToRemove: productsToRemove.map((e) => e._id) }).then(
            (res) => {
                // console.log(res);
                setProducts((prev) => [...prev, ...productsToRemove]);
                setProductsToRemove([]);
                toastSuccess("Products Updated");
                setCurrent(res);
            }
        );
    };

    const handleReset = () => {
        setProductsToRemove([]);
        if (!current) {
            setInventories({});
            return;
        }
        setInventories(Object.assign({}, ...current.inventory.map((e) => ({ [e.item._id]: e.inventoryCount }))));
    };

    const editInventory = (id: string, count: number) => {
        const currentInv = inventories[id];

        if (currentInv === undefined) {
            toastError("item does not exist");
            return;
        }

        if (count > 15) {
            toastError("maximum inventory is 15 pcs");
            return;
        }

        if (count < 0) {
            toastError("Inventory cannot be less than 0");
            return;
        }

        setInventories({ ...inventories, [id]: count });
    };

    useEffect(() => {
        if (!current) {
            setInventories({});
            return;
        }

        setInventories(Object.assign({}, ...current.inventory.map((e) => ({ [e.item._id]: e.inventoryCount }))));
    }, [current]);

    useEffect(() => {
        const controller = new AbortController();

        getMyMachines({ signal: controller.signal })
            .then((res) => {
                setOptions(res);
            })
            .catch(isCancelledErrorProcessor);

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!machineId) {
            return;
        }

        const controller = new AbortController();

        getNotAssignedProducts(machineId, { signal: controller.signal }).then((res) => {
            setProducts(res);
        });

        return () => controller.abort();
    }, [machineId]);

    useEffect(() => {
        if (!machineId) {
            setCurrent(null);
            return;
        }

        const controller = new AbortController();

        getMachine(machineId, { signal: controller.signal }).then((res) => {
            setCurrent(res);
            setAutocompleteValue({ _id: res._id, name: res.name });
        });

        return () => controller.abort();
    }, [machineId]);

    return (
        <Box>
            <Box display={"flex"} alignItems={"center"} gap="20px">
                <Autocomplete
                    fullWidth
                    blurOnSelect
                    value={autocompleteValue}
                    options={options}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    onChange={(_event, newValue) => {
                        setAutocompleteValue(newValue);

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
                <IconButton onClick={() => setEdit(true)}>
                    <EditIcon />
                </IconButton>
                {current && (
                    <EditMachine
                        open={edit}
                        dialogTitle="Rename machine"
                        machine={current}
                        onCancel={() => setEdit(false)}
                        onClose={() => setEdit(false)}
                        onSubmit={(data) => {
                            setCurrent((prev) => Object.assign({}, prev, data));
                            setOptions((prev) => prev.map((opt) => (opt._id === data._id ? { _id: data._id, name: data.name } : opt)));
                            setAutocompleteValue(data);

                            setEdit(false);
                        }}
                    />
                )}
            </Box>
            {machineId ? (
                <>
                    <Box display={"flex"} alignItems={"center"} gap="20px">
                        <Autocomplete
                            fullWidth
                            blurOnSelect
                            multiple
                            value={productsToAdd}
                            options={products}
                            isOptionEqualToValue={(option, val) => option._id === val._id}
                            onChange={(_event, newValue, reason) => {
                                console.log(reason, newValue);

                                setProductsToAdd(newValue);
                            }}
                            getOptionKey={(opt) => opt._id}
                            getOptionLabel={(option) => option.name || " "}
                            renderInput={(params) => (
                                <FormControl fullWidth sx={{ marginTop: 0 }}>
                                    <TextField
                                        {...params}
                                        label={"Products to ADD"}
                                        placeholder={"Products to ADD"}
                                        variant={"standard"}
                                        required
                                        error={false}
                                        helperText={" "}
                                    />
                                </FormControl>
                            )}
                        />
                        <IconButton onClick={addProductsHandle}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {current ? (
                        <Box>
                            <Box mb={2}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box display={"flex"} gap="20px">
                                            <Typography variant="body1">Coin Stacks:</Typography>
                                            <Chip
                                                size="medium"
                                                label={"refill all"}
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    refillCoins(current._id, {
                                                        oneCCoin: 50,
                                                        twoCCoin: 50,
                                                        fiveCCoin: 50,
                                                        tenCCoin: 50,
                                                        twentyCCoin: 50,
                                                        fiftyCCoin: 50,
                                                        oneDCoin: 50,
                                                        twoDCoin: 50,
                                                    }).then((res) => {
                                                        setCurrent((prev) =>
                                                            Object.assign({}, prev, {
                                                                oneCCoin: res.oneCCoin,
                                                                twoCCoin: res.twoCCoin,
                                                                fiveCCoin: res.fiveCCoin,
                                                                tenCCoin: res.tenCCoin,
                                                                twentyCCoin: res.twentyCCoin,
                                                                fiftyCCoin: res.fiftyCCoin,
                                                                oneDCoin: res.oneDCoin,
                                                                twoDCoin: res.twoDCoin,
                                                            })
                                                        );
                                                    });
                                                }}
                                                icon={<AddIcon />}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box display={"flex"} gap="20px">
                                            {coinIterationHelper.map((e) => (
                                                <Chip
                                                    size="medium"
                                                    key={e.field}
                                                    label={`${e.value}: ${current[e.field]}`}
                                                    variant="outlined"
                                                    onClick={() => {
                                                        refillCoins(current._id, { [e.field]: 50 }).then((res) =>
                                                            setCurrent((prev) => Object.assign({}, prev, { [e.field]: res[e.field] }))
                                                        );
                                                    }}
                                                    icon={<AddIcon />}
                                                />
                                            ))}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Available</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {current.inventory.map((item) => {
                                            const isToBeRemoved = productsToRemove.some((e) => e._id === item.item._id);

                                            return (
                                                <TableRow key={item._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        {item.item.name} {isToBeRemoved ? "TO BE DELETED" : null}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ maxWidth: "20px" }}>
                                                        {inventories[item.item._id]}
                                                        {inventories[item.item._id] !== item.inventoryCount ? "*" : null}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ maxWidth: "20px" }}>
                                                        <IconButton
                                                            onClick={() => editInventory(item.item._id, inventories[item.item._id] + 1)}
                                                            disabled={isToBeRemoved}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => editInventory(item.item._id, inventories[item.item._id] - 1)}
                                                            disabled={isToBeRemoved}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() =>
                                                                handleRemove({ _id: item.item._id, name: item.item.name }, isToBeRemoved)
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button variant="outlined" onClick={handleConfirm}>
                                Confirm Changes
                            </Button>
                            <Button variant="outlined" onClick={handleReset}>
                                Reset
                            </Button>
                        </Box>
                    ) : null}
                </>
            ) : null}
        </Box>
    );
};

export default MyMachines;
