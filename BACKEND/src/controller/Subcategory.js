import categoryModel from '../Models/CategoryDetails.js';
import subCategoryModel from '../Models/SubCategoryDetails.js';
import uploadImageCloudinary from '../Utils/Cloudinary.js';
import * as cloudinary_module from "cloudinary";
import mongoose from 'mongoose';

const Cloudinary = cloudinary_module.v2;

export const createSubcategory = async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name & category are required"
            })
        }
        let imageData = {}
        if (req.file) {
            const result = await uploadImageCloudinary(req.file.buffer)
            imageData = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        const subcategory = await subCategoryModel.create({
            name,
            category,
            image: imageData
        })
        return res.status(201).json({
            success: true,
            message: "SubCategory created successfully",
            data: subcategory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const getSubCategory = async (req, res) => {
    try {
        const data = await subCategoryModel.find({ status: true }).
            populate("category", "name image").sort({ createdAt: 1 })
        res.json({
            success: true,
            data: data
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
}
export const getSubCategoryByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        // console.log("name", categoryName);

        //find category by name
        const category = await categoryModel.findOne({
            name: { $regex: new RegExp(`^${categoryName}$`, 'i') },

        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        //find subcategories using category ID
        const data = await subCategoryModel.find({ category: { $in: [new mongoose.Types.ObjectId(category._id)] }, status: true }).populate("category", "name image")
        res.json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });


    }
}
export const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category } = req.body
        const subcategory = await subCategoryModel.findById(id);
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "subcategory not found"
            })
        }
        if (req.file) {
            if (subcategory.image?.public_id) {
                await Cloudinary.uploader.destroy(subcategory.image.public_id)
            }
            const result = await uploadImageCloudinary(req.file.buffer, "Ecommerce/subCategories");
            subcategory.image = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        subcategory.name = name || subcategory.name
        subcategory.category = category || subcategory.category
        await subcategory.save()
        res.json({
            success: true,
            message: "Subcategory updated Successfully",
            data: subcategory
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}
export const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await subCategoryModel.findByIdAndUpdate(id, { status: false }, { new: true })
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "subcategory not found"
            })
        }
        res.json({
            success: true,
            message: "Subcategory deleted successfully"
        })
    } catch (error) {

    }
}