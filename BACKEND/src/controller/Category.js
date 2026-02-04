import categoryModel from '../Models/CategoryDetails.js';
import uploadImageCloudinary from '../Utils/Cloudinary.js';
import * as cloudinary_module from 'cloudinary';
const Cloudinary = cloudinary_module.v2;

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        let image = {
            url: '',
            public_id: ""
        }
        if (req.file) {
            const result = await uploadImageCloudinary(
                req.file.buffer,
                "Ecommerce/categories"
            )
            image = {
                url: result.secure_url,
                public_id: result.public_id,
            }
        }
        const category = await categoryModel.create({ name, image });
        res.status(201).json({
            success: true,
            message: "category_created",
            data: category
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ createdAt: 1 })
        res.json({
            success: true,
            data: categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(400).json({ message: "category not Found" })
        }
        if (req.file) {
            if (category.image.public_id) {
                await Cloudinary.uploader.destroy(
                    category.image.public_id
                )
            }
            const result = await uploadImageCloudinary(req.file.buffer, "Ecommerce/categories")
            category.image = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        if (name) category.name = name;
        await category.save();
        res.json({
            success: true,
            message: "category Updated",
            data: category
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
}

export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                message: "category not found"
            })
        }
        if (category.image.public_id) {
            await Cloudinary.uploader.destroy(
                category.image.public_id
            )
        }
        await category.deleteOne();
        res.json({
            success: true,
            message: "category deleted",
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}