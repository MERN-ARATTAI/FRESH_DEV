import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Person_Details",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product_Data",
            required: true
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1
        },

        price: {
            type: Number,
            required: true
        },

        totalPrice: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "ordered"],
            default: "Active"
        }
    },
    { timestamps: true }
);

const CartProduct = mongoose.model("cartProduct_Data", cartProductSchema);
export default CartProduct;
