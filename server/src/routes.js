import { Router } from "express";
const router = Router();

import authController from "./controllers/authController.js";
import postController from "./controllers/postController.js";

// * debug
router.use((req, res, next) => {
  console.log("\x1b[34m", ">>> " + req.method + " >>> " + req.url, "\x1b[0m");
  next();
});
// * debug

router.use("/user", authController);
router.use("/posts", postController);
router.use("*", (req, res) => {
  console.log(req.body);
  res.write(
    "Hello i am restfull API -- please use my endpoints correctly -- /user; -- /posts",
  );
  res.end();
});

export default router;
