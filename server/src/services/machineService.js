import MachineModel from "../models/machine.js";

const create = (data) => {
    return MachineModel.create(data);
};

const getAllByOwner = (id) => {
    return MachineModel.find({ owner: id }, { name: 1 }, { sort: { name: 1 } }).lean();
};

const getAll = () => {
    return MachineModel.find({}, { name: 1 }, { sort: { name: 1 } })
        .select("name")
        .lean();
};

const getOne = (id) => {
    return MachineModel.findById(id).populate("owner", "-password").populate("inventory.item").lean();
};

const getOneRaw = (id) => {
    return MachineModel.findById(id).populate("owner", "-password").populate("inventory.item");
};

const getOneSimple = (id) => {
    return MachineModel.findById(id).lean();
};

const updateOne = (id, data) => {
    return MachineModel.findByIdAndUpdate(id, data, { runValidators: true, new: true });
};

const deleteOne = (id) => {
    return MachineModel.findByIdAndDelete(id);
};

const MachineService = {
    create,
    getAll,
    getAllByOwner,
    getOne,
    getOneRaw,
    updateOne,
    deleteOne,
    getOneSimple,
};

export default MachineService;
