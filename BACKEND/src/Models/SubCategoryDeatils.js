import mongoose from 'mongoose'

const subCategorySchema = new mongoose.Schema({
    name: { type: String, default: "" },
    image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category_Data'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const subCategoryModel = mongoose.model('subCategory_Data', subCategorySchema)

export default subCategoryModel

