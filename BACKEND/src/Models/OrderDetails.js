import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "product_Data",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "Person_Details",
            required: true,
        },
        items: [orderItemSchema],
        shippingAddress: {
            name: String,
            email: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        paymentMethod: {
            type: String,
            enum: ["creditCard", "debitCard", "upi", "bankTransfer", "paypal"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        orderStatus: {
            type: String,
            enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
            default: "placed",
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        taxAmount: {
            type: Number,
            default: 0,
        },
        notes: String,
    },
    { timestamps: true }
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model("Order_Details", orderSchema);

export default Order;
