import jwt from "jsonwebtoken";
import util from "util";
import { cookie_name, secret } from "../server.js";

const auth = async (req, res, next) => {
    const token = req.cookies[cookie_name];
    if (!token) {
        return next();
    }
    try {
        const user = await util.promisify(jwt.verify)(token, secret);
        req.user = user;
        res.locals.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.clearCookie(cookie_name);
        res.status(400).json({
            type: "unauthorized-invalid-token",
            message: "you shall not pass",
        });
        // res.redirect("/login");
    }
};

const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(400).json({
            type: "unauthorized-guests",
            message: "you shall not pass as guest",
        });
    }
    next();
};

const isGuest = (req, res, next) => {
    if (req.user) {
        return res.status(400).json({
            type: "unauthorized-users",
            message: "you shall not pass as user",
        });
    }
    next();
};

const AuthMiddleware = {
    auth,
    isAuth,
    isGuest,
};

export default AuthMiddleware;
