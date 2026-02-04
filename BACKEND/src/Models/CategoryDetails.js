import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, default: "" },
    image: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    }
},
    {
        timestamps: true
    })

const categoryModel = mongoose.model('category_Data', categorySchema)

export default categoryModel