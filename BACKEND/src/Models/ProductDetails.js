import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: [
            {
                url: String,
                public_id: String
            }
        ],
        brand: {
            type: String,
        },

        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category_Data"
        },
        subCategory: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "subCategory_Data"
            }
        ],
        unit: {
            type: String,
            default: ""
        },
        stock: {
            type: Number,
            default: null
        },
        price: {
            type: Number,
            default: null
        },
        discount: {
            type: Number,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        more_details: {
            type: Object,
            default: {}
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Product = mongoose.model("product_Data", productSchema);

export default Product
