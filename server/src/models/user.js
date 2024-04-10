import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { saltRounds } from "../server.js";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [3, "First name is too short"],
    // unique: true,
    validate: [
      /^[a-z]+$/i,
      "First name must be only letters. No special characters allowed.",
    ],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [5, "Last name is too short"],
    // unique: true,
    validate: [
      /^[a-z]+$/i,
      "Last name must be only letters. No special characters allowed.",
    ],
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "email is too short"],
    // unique: true,
    validate: [
      /^\w+@{1}\w+\.{1}[a-z]{2,3}$/i,
      "Email must be valid to mailbox@domain.bg/com",
    ],
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
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

UserSchema.method("verifyPass", function (pass) {
  return bcrypt.compare(pass, this.password);
});

const User = mongoose.model("User", UserSchema);

export default User;
