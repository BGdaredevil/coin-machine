import ProductModel from "../models/product.js";

const create = (data) => {
    return ProductModel.create(data);
};

const getAllByOwner = (id) => {
    return ProductModel.find({ owner: id }).lean();
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

// const join = async (courseId, user) => {
//     const item = await ProductModel.findById(courseId);

//     item.voteList.push(user.id);
//     // await userService.enrollInCourse(courseId, user.id);
//     return item.updateOne({ $set: { voteList: item.voteList } });
// };

// const search = async (searchObjQ) => {
//     console.log(searchObjQ);
//     const searchObj = {};

//     if (searchObjQ.name) {
//         searchObj.name = new RegExp(searchObjQ.name, "i");
//     }

//     if (searchObjQ.type) {
//         searchObj.typeVolcano = new RegExp(searchObjQ.type, "i");
//     }

//     return ProductModel.find(searchObj).lean();
// };

const ProductService = {
    // getAllPublic,
    create,
    getAll,
    getAllByOwner,
    getOne,
    updateOne,
    deleteOne,
    // join,
    // search,
    getOneSimple,
};

export default ProductService;
