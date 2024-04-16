import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { saltRounds } from "../server.js";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: [5, "Email is too short"],
        // unique: true,
        validate: [/^\w+@{1}\w+\.{1}[a-z]{2,3}$/i, "Email must be valid to mailbox@domain.bg/com"],
    },
    password: {
        type: String,
        required: true,
        minlength: [4, "Password is too short"],
        // validate: [
        //   /^[a-z0-9]+$/i,
        //   "Password must be only letters and numbers. No special characters allowed.",
        // ],
    },
});

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.method("verifyPass", function (pass) {
    return bcrypt.compare(pass, this.password);
});

const User = mongoose.model("User", UserSchema);

export default User;
