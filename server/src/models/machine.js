import mongoose from "mongoose";

const MachineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: [2, "Name is too short"] },
        oneCCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        twoCCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        fiveCCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        tenCCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        twentyCCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        fiftyCCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        oneDCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        twoDCoin: { type: Number, default: 0, max: [50, "Max inventory space is 50 coins"] },
        overflow: { type: Number, default: 0 },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        inventory: [
            {
                inventoryCount: {
                    type: Number,
                    default: 0,
                    min: [0, "Inventory count should be positive"],
                    max: [15, "Max inventory space is 15 items"],
                },
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],
    },
    { timestamps: true }
);

MachineSchema.pre("deleteOne", function () {
    //todo fix references on delete with the user
});

const MachineModel = mongoose.model("Machine", MachineSchema);

export default MachineModel;
