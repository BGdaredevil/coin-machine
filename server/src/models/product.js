import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: [2, "Name is too short"] },
        description: { type: String, required: true, minlength: [10, "Description is too short"] },
        imageUrl: {
            type: String,
            required: true,
            validate: [/^https?:\/{2}/, "Please enter a valid URL"],
        },
        price: { type: Number, required: true, min: [0.01, "Price should be a positive number"] },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

ProductSchema.pre("deleteOne", function () {
    //todo fix references on delete with the user
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
