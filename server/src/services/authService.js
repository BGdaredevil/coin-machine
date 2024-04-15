import User from "../models/user.js";

const register = (user) => {
    return User.create(user);
};

const login = async (user) => {
    const item = await User.findOne({ email: user.email });
    if (!item) {
        return null;
    }

    const validPass = await item.verifyPass(user.password);

    return validPass ? item : null;
};

const getUser = (id) => {
    return User.findById(id).lean();
};

const checkEmail = async (email) => {
    let temp = await User.findOne({ email }).lean();

    return temp != null;
};

export default { register, login, getUser, checkEmail };
