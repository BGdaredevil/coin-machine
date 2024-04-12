import express from "express";
import baseConfig from "./config/config.js";
import expressConfig from "./config/expressConfig.js";
import dbConfig from "./config/dbConfig.js";

const app = express();

const config = baseConfig[process.env.APP_ENV || "development"];

export const saltRounds = config.saltRounds;
export const dBaseUrl = config.dBaseUrl;
export const tokenExpDate = config.tokenExpDate;
export const secret = config.secret;
export const cookie_name = config.cookie_name;

(async () => {
    expressConfig(app);
    dbConfig(app)
        .then((app) => {
            console.log("\x1b[34m", `I think the DB is connected at ${config.dBaseUrl}`, "\x1b[0m");
            app.listen(config.appPort, console.log("\x1b[34m", `Server is listening on port ${config.appPort}...`, "\x1b[0m"));
        })
        .catch((err) => {
            console.log("\x1b[33m", "DB Connection error!", "\x1b[0m");
            console.error(err);
        });
})();
