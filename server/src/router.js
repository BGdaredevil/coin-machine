import { Router } from "express";
const router = Router();

import authController from "./controllers/authController.js";
import productController from "./controllers/productController.js";
import machineController from "./controllers/machineController.js";

// * debug
// router.use((req, res, next) => {
//     console.log("\x1b[34m", ">>> " + req.method + " >>> " + req.url, "\x1b[0m");
//     next();
// });
// * debug

router.use("/user", authController);
router.use("/product", productController);
router.use("/machine", machineController);

router.use("*", (req, res) => {
    console.log(req.body);
    res.status(200).json({
        message: "Hello i am restfull API -- please use my endpoints correctly -- /user; ",
    });
    res.end();
});

export default router;
