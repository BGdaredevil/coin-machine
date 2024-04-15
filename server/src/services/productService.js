import MachineModel from "../models/machine.js";
import ProductModel from "../models/product.js";

const create = (data) => {
    return ProductModel.create(data);
};

const getAllByOwner = (id) => {
    return ProductModel.find({ owner: id }).lean();
};

const getAllByOwnerNotInMachine = async (ownerId, machineId) => {
    const rest = await MachineModel.findById(machineId)
        .select("inventory.item")
        .transform((doc) => (doc == null ? doc : doc.inventory.map((e) => e.item)));

    return ProductModel.find({ owner: ownerId, _id: { $nin: [...rest] } }).lean();
};

const getAll = () => {
    return ProductModel.find({}).lean();
};

const getOne = (id) => {
    return ProductModel.findById(id).populate("owner").lean();
};

const getOneSimple = (id) => {
    return ProductModel.findById(id).lean();
};

const updateOne = (id, data) => {
    return ProductModel.findByIdAndUpdate(id, data, { runValidators: true, new: true });
};

const deleteOne = (id) => {
    return ProductModel.findByIdAndDelete(id);
};

const ProductService = {
    create,
    getAll,
    getAllByOwner,
    getOne,
    updateOne,
    deleteOne,
    getOneSimple,
    getAllByOwnerNotInMachine,
};

export default ProductService;
