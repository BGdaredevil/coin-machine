import jwt from "jsonwebtoken";
import util from "util";

import { tokenExpDate } from "../server.js";
import { secret } from "../server.js";

export default (user) => {
    return util.promisify(jwt.sign)({ email: user.email, id: user._id }, secret, {
        expiresIn: tokenExpDate,
    });
};
