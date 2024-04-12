import { Router } from "express";
import ProductService from "../services/productService.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const loadAll = async (req, res) => {
    try {
        const products = await ProductService.getAll();

        res.status(200).json({ products });
    } catch (err) {
        res.status(412).json({ type: "data-access-error", message: "Cannot load this data" });
    }
};

// const searchRenderer = async (req, res) => {
//     const dataObj = { items: [] };

//     if (req.query.name || req.query.type) {
//         dataObj.searchName = req.query.name;
//         dataObj.searchType = req.query.type;
//         dataObj.items = await ProductService.search({
//             name: req.query.name,
//             type: req.query.type,
//         });

//         return res.render("volcano/search", dataObj);
//     }

//     dataObj.items = await ProductService.getAll();
//     console.log(dataObj);
//     return res.render("volcano/search", dataObj);
// };

// ? Check all render calls !!
const create = async (req, res) => {
    const escapedProduct = {
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl.trim(),
        price: req.body.price.trim(),
        inventoryCount: req.body.inventoryCount.trim(),
        owner: req.user.id,
    };

    try {
        if (Object.values(escapedProduct).includes("")) {
            res.status(412).json({ type: "missing-data-error", message: "Incomplete dataset" });

            console.log("empty detected");
            return;
        }

        const newInstance = await ProductService.create(escapedProduct);

        newInstance;

        res.status(200).json({
            id: newInstance._id,
            name: newInstance.name,
            description: newInstance.description,
            imageUrl: newInstance.imageUrl,
            price: newInstance.price,
            inventoryCount: newInstance.inventoryCount,
            owner: newInstance.owner,
        });
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

// ? Check all render calls !!
const edit = async (req, res) => {
    const escapedProduct = {
        _id: req.params.id,
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        imageUrl: req.body.imageUrl.trim(),
        price: req.body.price.trim(),
        inventoryCount: req.body.inventoryCount.trim(),
        owner: req.user.id,
    };

    try {
        if (Object.values(escapedProduct).includes("")) {
            res.status(412).json({ type: "missing-data-error", message: "Incomplete dataset" });

            console.log("empty detected");
            return;
        }

        await ProductService.updateOne(req.params.id, escapedProduct);
        res.redirect(`/volcano/details/${req.params.id}`);
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

// // ? Check all render calls !!
// const vote = async (req, res) => {
//     try {
//         await ProductService.join(req.params.id, req.user);
//         res.redirect(`/volcano/details/${req.params.id}`);
//     } catch (err) {
//         console.log(err);
//     }
// };
// ? Check all render calls !!
const remove = async (req, res) => {
    try {
        const instance = await ProductService.deleteOne(req.params.id);
        res.status(200).json({ type: "sucess", message: "deleted", instance });
    } catch (err) {
        console.log(err);
    }
};

// const loadItem = async (req, res, next) => {
//     const item = await ProductService.getOne(req.params.id);
//     const isOwner = item.owner == req?.user?.id;
//     const isVoted = item.voteList.some((x) => x._id == req?.user?.id);

//     res.locals.item = item;
//     res.locals.isOwner = isOwner;
//     res.locals.isVoted = isVoted;

//     next();
// };

const canTouch = async (req, res, next) => {
    const item = await ProductService.getOne(req.params.id);
    const isOwner = item.owner == req?.user?.id;

    if (isOwner) {
        next();
        return;
    }
    res.status(412).json({ type: "invalid-data-errors", message: "this is not your product" });

    // res.redirect(`/volcano/not-allowed-action?error=${encodeURIComponent("you cannot edit/delete this item")}`);
};

// const canVote = (req, res, next) => {
//     if (!res.locals.isVoted && !res.locals.isOwner) {
//         next();
//         return;
//     }

//     res.redirect(`/volcano/not-allowed-action?error=${encodeURIComponent("you cannot vote more than once")}`);
// };

router.get("/catalog", loadAll);

// router.get("/search", searchRenderer);
// router.post("/search", searchRenderer);

// router.get("/create", isAuth, (req, res) => res.render("volcano/create"));
router.post("/create", AuthMiddleware.isAuth, create);

// router.get("/details/:id", loadItem, (req, res) => res.render("volcano/details"));

// router.get("/edit/:id", isAuth, loadItem, canTouch, (req, res) => res.render("volcano/edit"));
router.post("/edit/:id", AuthMiddleware.isAuth, canTouch, edit);

// router.get("/vote/:id", isAuth, loadItem, canVote, vote);
router.get("/delete/:id", AuthMiddleware.isAuth, canTouch, remove);

export default router;
