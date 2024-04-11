import "dotenv/config";

export default {
    development: {
        appPort: process.env.APP_PORT || "3030",
        host: process.env.DB_HOST || "localhost",
        DBPort: process.env.DB_PORT || "27017",
        table: process.env.DB_TABLE || "WildLife",
        dBaseUrl: `mongodb://${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "27017"}/${process.env.DB_TABLE || "WildLife"}`,
        saltRounds: process.env.SALT_ROUNDS || 10,
        cookie_name: process.env.COOKIE_NAME || "WildLife",
        secret: process.env.SECRET || "pesho believes that gosho is something else entirely",
        tokenExpDate: process.env.TOKEN_EXPIRY_DATE || "1h",
    },
    production: {},
};
