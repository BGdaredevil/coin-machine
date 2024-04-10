import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "../routes.js";

export default (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      // methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
      credentials: true,
    })
  );
  app.use((req, res, next) => {
    res.header("Access-Control-allow-Credentials", true);
    next();
  });
  app.use(router);
};
