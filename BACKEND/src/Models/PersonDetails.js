import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const UserScheme = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirm_password: { type: String, },
    mobile: { type: Number, default: null },
    verify_email: { type: Boolean, default: false },
    last_login_data: { type: Date, default: null },
    status: { type: String, enum: ["Active", "inactive"], default: "Active" },
    address_details: [{ type: mongoose.Schema.ObjectId, ref: "address_Data" }],
    shopping_cart: [{ type: mongoose.Schema.ObjectId, ref: "cartProduct_Data" }],
    order_Histroy: [{ type: mongoose.Schema.ObjectId, ref: "Order_Data" }],
    forgot_password_otp: { type: String, default: null },
    forgot_password_expiry: { type: Date, default: null },
    role: { type: String, enum: ["Admin", "Users"], default: "Users" }
}, { timestamps: true })

UserScheme.pre("save", async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10)
})

UserScheme.methods.matchPassword = function (enterPassword) {
    return bcrypt.compare(enterPassword, this.password)
}

const UserData = mongoose.model("Person_Details", UserScheme)

export default UserData;