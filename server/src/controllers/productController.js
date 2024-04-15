import { Router } from "express";
import ProductService from "../services/productService.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const publicLoadAllByOwner = async (req, res, next) => {
    if (req.query.person) {
        try {
            const products = await ProductService.getAllByOwner(req.query.person);

            res.status(200).json(products);
        } catch (err) {
            res.status(412).json({ type: "data-access-error", message: "invalid person" });
        }
        return;
    }

    next();
};

const loadAllByOwner = async (req, res) => {
    try {
        const products = await ProductService.getAllByOwner(req.user.id);

        res.status(200).json(products);
    } catch (err) {
        res.status(412).json({ type: "data-access-error", message: "Cannot load this data" });
    }
};
const create = async (req, res) => {
    const escapedProduct = {
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl.trim(),
        price: req.body.price,
        owner: req.user.id,
    };

    try {
        if (Object.values(escapedProduct).includes("")) {
            res.status(412).json({ type: "missing-data-error", message: "Incomplete dataset" });

            console.log("empty detected");
            return;
        }

        const newInstance = await ProductService.create(escapedProduct);

        res.status(200).json({
            id: newInstance._id,
            name: newInstance.name,
            description: newInstance.description,
            imageUrl: newInstance.imageUrl,
            price: newInstance.price,
            owner: newInstance.owner,
        });
    } catch (err) {
        const errKeys = Object.keys(err?.errors);
        if (
            errKeys.includes("name") ||
            errKeys.includes("description") ||
            errKeys.includes("imageUrl") ||
            errKeys.includes("price") ||
            errKeys.includes("owner")
        ) {
            const errMess = [
                err.errors.name?.message,
                err.errors.description?.message,
                err.errors.imageUrl?.message,
                err.errors.price?.message,
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

// ? Check all render calls !!
const edit = async (req, res) => {
    const escapedProduct = {
        _id: req.params.id,
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl.trim(),
        price: req.body.price,
    };

    try {
        if (Object.values(escapedProduct).includes("")) {
            res.status(412).json({ type: "missing-data-error", message: "Incomplete dataset" });

            console.log("empty detected");
            return;
        }

        const newInstance = await ProductService.updateOne(req.params.id, escapedProduct);

        res.status(200).json(newInstance.toObject());
    } catch (err) {
        const errKeys = Object.keys(err?.errors);
        if (
            errKeys.includes("name") ||
            errKeys.includes("description") ||
            errKeys.includes("imageUrl") ||
            errKeys.includes("price") ||
            errKeys.includes("owner")
        ) {
            const errMess = [
                err.errors.name?.message,
                err.errors.description?.message,
                err.errors.imageUrl?.message,
                err.errors.price?.message,
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
        const instance = await ProductService.deleteOne(req.params.id);
        res.status(200).json({ type: "sucess", message: "deleted", instance });
    } catch (err) {
        console.log(err);
    }
};

const canTouch = async (req, res, next) => {
    const item = await ProductService.getOne(req.params.id);
    const isOwner = item.owner._id == req?.user?.id;

    if (isOwner) {
        next();
        return;
    }

    res.status(412).json({ type: "invalid-data-errors", message: "this is not your product" });
};

router.get("/catalog", publicLoadAllByOwner, AuthMiddleware.isAuth, loadAllByOwner);

router.post("/create", AuthMiddleware.isAuth, create);

router.post("/edit/:id", AuthMiddleware.isAuth, canTouch, edit);

router.get("/delete/:id", AuthMiddleware.isAuth, canTouch, remove);

export default router;
