import mongoose from "mongoose";

import { dBaseUrl } from "../server.js";

export default async (app) => {
    try {
        await mongoose.connect(dBaseUrl);

        return app;
    } catch (err) {
        throw err;
    }
};
