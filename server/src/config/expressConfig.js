import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "../routes.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export default (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(
        cors({
            origin: "http://localhost:3000",
            methods: ["POST", "PUT", "GET", "OPTIONS", "PATCH", "DELETE"],
            credentials: true,
        })
    );
    // app.use((req, res, next) => {
    //     res.header("Access-Control-allow-Credentials", true);
    //     next();
    // });
    app.use(AuthMiddleware.auth);

    app.use(router);
};
