import { Router } from "express";
import authService from "../services/authService.js";
import getToken from "../utils/getToken.js";
import { cookie_name } from "../server.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", AuthMiddleware.isGuest, async (req, res) => {
    const cleanUser = {
        email: req.body.email.trim(),
        password: req.body.password.trim(),
    };

    if (Object.values(cleanUser).includes("")) {
        res.status(412).json({ type: "missing data", message: "pls fill all data" });

        return;
    }

    if (cleanUser.password !== req.body.repeatPassword) {
        res.status(412).json({ type: "pass mismatch", message: "passwords do not math" });

        return;
    }

    if (await authService.checkEmail(cleanUser.email)) {
        res.status(412).json({ type: "name conflict", message: "name is taken" });

        return;
    }

    try {
        const newUser = await authService.register(cleanUser);
        const token = await getToken(newUser);

        res.cookie(cookie_name, token, { httpOnly: true });
        res.status(200).json({ email: newUser.email, id: newUser._id, token });
    } catch (err) {
        res.status(412).json({
            type: "validation",
            message: Object.keys(err?.errors)
                .map((e) => err.errors[e].message)
                .join("\n"),
        });
    }
});

router.post("/login", AuthMiddleware.isGuest, async (req, res) => {
    const cleanData = {
        email: req.body.email.trim(),
        password: req.body.password.trim(),
    };

    try {
        const user = await authService.login(cleanData);
        if (!user) {
            res.status(412).json({ type: "user", message: "Invalid username or password" });
            return;
        }

        const token = await getToken(user);

        res.cookie(cookie_name, token, { httpOnly: true });
        res.status(200).json({ email: user.email, id: user._id, token });

        return;
    } catch (err) {
        res.status(412).json({
            type: "validation",
            message: Object.keys(err?.errors)
                .map((e) => err.errors[e].message)
                .join("\n"),
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie(cookie_name);
    res.status(200).json({ type: "message", message: "sucess" });
});

router.get("/:id", AuthMiddleware.isAuth, async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            throw new Errror("user tries to access another");
        }

        const person = await authService.getUser(req.params.id);
        res.status(200).json({ email: person.email, id: person._id });
    } catch (err) {
        res.status(412).json({ type: "wrong-data", message: "invalid data" });
    }
});

export default router;
