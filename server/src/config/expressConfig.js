import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "../router.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export default (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            methods: ["POST", "PUT", "GET", "OPTIONS", "PATCH", "DELETE"],
            credentials: true,
        })
    );
    app.use(AuthMiddleware.auth);

    app.use(router);
};
