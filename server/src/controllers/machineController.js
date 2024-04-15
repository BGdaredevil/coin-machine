import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import MachineService from "../services/machineService.js";
import ProductService from "../services/productService.js";

const coinKeys = ["twoDCoin", "oneDCoin", "fiftyCCoin", "twentyCCoin", "tenCCoin", "fiveCCoin", "twoCCoin", "oneCCoin"];
const coinValueMap = {
    oneCCoin: 0.01,
    twoCCoin: 0.02,
    fiveCCoin: 0.05,
    tenCCoin: 0.1,
    twentyCCoin: 0.2,
    fiftyCCoin: 0.5,
    oneDCoin: 1,
    twoDCoin: 2,
};

const router = Router();

const publicLoadAllByOwner = async (req, res, next) => {
    if (req.query.person) {
        try {
            const machines = await MachineService.getAllByOwner(req.query.person);

            res.status(200).json(machines);
        } catch (err) {
            res.status(412).json({ type: "data-access-error", message: "invalid person" });
        }
        return;
    }

    next();
};

const loadAllByOwner = async (req, res) => {
    try {
        const machines = await MachineService.getAllByOwner(req.user.id);

        res.status(200).json(machines);
    } catch (err) {
        res.status(412).json({ type: "data-access-error", message: "Cannot load this data" });
    }
};

const loadAll = async (req, res) => {
    try {
        const machines = await MachineService.getAll();

        res.status(200).json(machines);
    } catch (err) {
        res.status(412).json({ type: "data-access-error", message: "Cannot load this data" });
    }
};

const loadOne = async (req, res) => {
    try {
        const machine = await MachineService.getOne(req.params.id);

        res.status(200).json(machine);
    } catch (err) {
        res.status(412).json({ type: "data-access-error", message: "Cannot load this data" });
    }
};

const create = async (req, res) => {
    const escapedProduct = {
        name: req.body.name.trim(),
        owner: req.user.id,
    };

    try {
        if (Object.values(escapedProduct).includes("")) {
            res.status(412).json({ type: "missing-data-error", message: "Incomplete dataset" });

            return;
        }

        const newInstance = await MachineService.create(escapedProduct);

        res.status(200).json(newInstance.toObject());
    } catch (err) {
        const errKeys = Object.keys(err?.errors);
        if (
            errKeys.includes("name") ||
            errKeys.includes("description") ||
            errKeys.includes("imageUrl") ||
            errKeys.includes("price") ||
            errKeys.includes("inventoryCount") ||
            errKeys.includes("owner")
        ) {
            const errMess = [
                err.errors.name?.message,
                err.errors.description?.message,
                err.errors.imageUrl?.message,
                err.errors.price?.message,
                err.errors.inventoryCount?.message,
                err.errors.owner?.message,
            ]
                .filter((e) => e != undefined)
                .map((e) => ({ message: e }));

            errMess;
            res.status(412).json({ type: "invalid-data-errors", message: errMess });
        } else {
            throw err;
        }
    }
};

const purchase = async (req, res) => {
    try {
        const machineId = req.params.machineId;
        const productId = req.params.productId;
        const qty = req.body.qty;
        const userAddedCoins = req.body.userAddedCoins;
        const machine = await MachineService.getOneRaw(machineId);

        const productRef = machine.inventory.find((e) => e.item._id.toString() === productId);

        if (!productRef) {
            res.status(412).json({ type: "no-such-product", message: "this item is not offered by this machine" });
            return;
        }

        if (productRef.inventoryCount < qty) {
            if (productRef.inventoryCount === 0) {
                res.status(412).json({ type: "no-inventory", message: "item is out of stock" });
                return;
            }

            res.status(412).json({ type: "no-inventory", message: `Only ${productRef.inventoryCount} pcs are available` });
            return;
        }

        const totalRaw = Object.entries(userAddedCoins)
            .filter((e) => coinKeys.includes(e[0]))
            .reduce((a, [field, count]) => (a += coinValueMap[field] * count), 0);
        const totalGiven = Math.round(totalRaw * 100) / 100;
        const totalNeeded = Math.round(qty * productRef.item.price * 100) / 100;

        if (totalGiven < totalNeeded) {
            res.status(412).json({ type: "no-enough-paid", message: "please add more coins" });
            return;
        }

        const remaining = Math.round((totalGiven - totalNeeded) * 100) / 100;

        machine.inventory = machine.inventory.map((invItem) =>
            invItem.item._id.toString() === productId ? { ...invItem, inventoryCount: invItem.inventoryCount - qty } : invItem
        );

        if (remaining === 0) {
            let overflow = machine.overflow;

            coinKeys.forEach((field) => {
                if (userAddedCoins[field] === 0) {
                    return;
                }

                machine[field] = machine[field] + userAddedCoins[field];
                if (machine[field] > 50) {
                    const rem = machine[field] - 50;
                    machine[field] = 50;
                    overflow = overflow + rem * coinValueMap[field];
                }
            });

            overflow = Math.round(overflow * 100) / 100;
            machine.overflow = overflow;

            await machine.updateOne({
                $set: {
                    inventory: machine.inventory,
                    overflow: machine.overflow,
                    oneCCoin: machine.oneCCoin,
                    twoCCoin: machine.twoCCoin,
                    fiveCCoin: machine.fiveCCoin,
                    tenCCoin: machine.tenCCoin,
                    twentyCCoin: machine.twentyCCoin,
                    fiftyCCoin: machine.fiftyCCoin,
                    oneDCoin: machine.oneDCoin,
                    twoDCoin: machine.twoDCoin,
                },
            });

            const updated = await MachineService.getOne(machineId);
            res.status(200).json(updated);
            return;
        }

        let calculationRemaining = remaining;
        const coinValues = coinKeys.map((field) => coinValueMap[field]);
        const machineAvailableCoins = coinKeys.map((field) => machine[field]);
        const neededCoins = new Array(coinValues.length).fill(0);

        for (let i = 0; i < coinValues.length; i++) {
            const currentCoinValue = coinValues[i];

            while (calculationRemaining >= currentCoinValue) {
                neededCoins[i] += 1;

                if (neededCoins[i] > machineAvailableCoins[i]) {
                    neededCoins[i] -= 1;

                    break;
                }

                calculationRemaining = Math.round((calculationRemaining - currentCoinValue) * 100) / 100;
            }
        }

        if (calculationRemaining > 0) {
            res.status(200).json({
                type: "no-enough-coins",
                message: `sorry, the machine does not have enough coins to return  ${calculationRemaining} EUR in change. Returning all user coins`,
            });
            return;
        }

        let overflow = machine.overflow;
        for (let i = 0; i < neededCoins.length; i++) {
            if (neededCoins[i] === 0) {
                continue;
            }

            const field = coinKeys[i];
            machine[field] = machine[field] - neededCoins[i] + userAddedCoins[field];
            if (machine[field] > 50) {
                const rem = machine[field] - 50;
                machine[field] = 50;
                overflow = overflow + rem * coinValueMap[field];
            }
        }

        overflow = Math.round(overflow * 100) / 100;
        machine.overflow = overflow;

        await machine.updateOne({
            $set: {
                inventory: machine.inventory,
                overflow: machine.overflow,
                oneCCoin: machine.oneCCoin,
                twoCCoin: machine.twoCCoin,
                fiveCCoin: machine.fiveCCoin,
                tenCCoin: machine.tenCCoin,
                twentyCCoin: machine.twentyCCoin,
                fiftyCCoin: machine.fiftyCCoin,
                oneDCoin: machine.oneDCoin,
                twoDCoin: machine.twoDCoin,
            },
        });

        const updated = await MachineService.getOne(machineId);

        res.status(200).json(updated);
    } catch (error) {
        res.status(500);
    }
};

const getNotAssignedProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllByOwnerNotInMachine(req.user.id, req.params.id);

        res.status(200).json(products);
    } catch (error) {
        res.status(500);
    }
};

const editMachineProducts = async (req, res) => {
    try {
        const machine = await MachineService.getOneRaw(req.params.id);
        const productsToRemove = req.body.productsToRemove;
        const invChanges = req.body.inventoryChanges;

        machine.inventory = machine.inventory.filter((e) => !productsToRemove.includes(e.item._id.toString()));
        machine.inventory = machine.inventory.map((invItem) => ({
            ...invItem,
            inventoryCount: invChanges[invItem.item._id.toString()],
        }));

        await machine.updateOne({ $set: { inventory: machine.inventory } });

        const updated = await MachineService.getOne(req.params.id);

        res.status(200).json(updated);
    } catch (error) {
        res.status(500);
    }
};

const addProducts = async (req, res) => {
    try {
        const machine = await MachineService.getOneRaw(req.params.id);
        const existingIds = machine.inventory.map((e) => e.item._id.toString());
        const productsToAdd = req.body.productsToAdd
            .filter((e) => !existingIds.includes(e))
            .map((productId) => ({ inventoryCount: 0, item: productId }));

        machine.inventory.push(...productsToAdd);
        await machine.updateOne({ $set: { inventory: machine.inventory } });

        const updated = await MachineService.getOne(req.params.id);

        res.status(200).json(updated);
    } catch (error) {
        res.status(500);
    }
};

const refillCoins = async (req, res) => {
    try {
        const coinLabels = Object.keys(req.body);
        // todo find better way to not inject foreign keys
        const updateObj = Object.assign({}, ...coinKeys.filter((e) => coinLabels.includes(e)).map((e) => ({ [e]: 50 })));
        const newInstance = await MachineService.updateOne(req.params.id, updateObj);

        res.status(200).json(newInstance.toObject());
    } catch (error) {
        res.status(500);
    }
};

// ? Check all render calls !!
const edit = async (req, res) => {
    const escapedMachine = {
        _id: req.params.id,
        name: req.body.name.trim(),
    };

    try {
        if (Object.values(escapedMachine).includes("")) {
            res.status(412).json({ type: "missing-data-error", message: "Incomplete dataset" });
            return;
        }

        const newInstance = await MachineService.updateOne(req.params.id, escapedMachine);

        res.status(200).json(newInstance.toObject());
    } catch (err) {
        const errKeys = Object.keys(err?.errors);
        if (
            errKeys.includes("name") ||
            errKeys.includes("description") ||
            errKeys.includes("imageUrl") ||
            errKeys.includes("price") ||
            errKeys.includes("inventoryCount") ||
            errKeys.includes("owner")
        ) {
            const errMess = [
                err.errors.name?.message,
                err.errors.description?.message,
                err.errors.imageUrl?.message,
                err.errors.price?.message,
                err.errors.inventoryCount?.message,
                err.errors.owner?.message,
            ]
                .filter((e) => e != undefined)
                .map((e) => ({ message: e }));

            res.status(412).json({ type: "invalid-data-errors", message: errMess });
        } else {
            throw err;
        }
    }
};

const remove = async (req, res) => {
    try {
        const instance = await MachineService.deleteOne(req.params.id);
        res.status(200).json({ type: "sucess", message: "deleted", instance });
    } catch (err) {
        console.log(err);
    }
};

const canTouch = async (req, res, next) => {
    const item = await MachineService.getOne(req.params.id);
    const isOwner = item.owner._id == req?.user?.id;

    if (isOwner) {
        next();
        return;
    }
    res.status(412).json({ type: "invalid-data-errors", message: "this is not your product" });
};

router.get("/public-catalog", loadAll);
router.get("/catalog", publicLoadAllByOwner, AuthMiddleware.isAuth, loadAllByOwner);

router.get("/:id", loadOne);

router.post("/create", AuthMiddleware.isAuth, create);

router.put("/edit/:id", AuthMiddleware.isAuth, canTouch, edit);

router.put("/coins/:id/refill", AuthMiddleware.isAuth, canTouch, refillCoins);

router.put("/purchase/:machineId/:productId", purchase);

router.get("/inventory/:id/not-products", AuthMiddleware.isAuth, canTouch, getNotAssignedProducts);
router.put("/inventory/:id/add-products", AuthMiddleware.isAuth, canTouch, addProducts);
router.put("/inventory/:id/edit-machine-products", AuthMiddleware.isAuth, canTouch, editMachineProducts);

router.get("/delete/:id", AuthMiddleware.isAuth, canTouch, remove);

export default router;
