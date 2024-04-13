import MachineModel from "../models/machine.js";

const create = (data) => {
    return MachineModel.create(data);
};

const getAllByOwner = (id) => {
    return MachineModel.find({ owner: id }).lean();
};

const getAll = () => {
    return MachineModel.find({}).lean();
};

const getOne = (id) => {
    return MachineModel.findById(id).populate("owner").populate("inventory.item").lean();
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

// const join = async (courseId, user) => {
//     const item = await MachineModel.findById(courseId);

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

//     return MachineModel.find(searchObj).lean();
// };

const MachineService = {
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

export default MachineService;
