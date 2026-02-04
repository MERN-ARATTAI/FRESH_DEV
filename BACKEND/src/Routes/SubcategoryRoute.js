import express from "express";
import { Protect } from "../Middleware/User.js";
import { Admin } from "../Middleware/Admin.js";
import upload from "../Middleware/Multer.js";
import { createSubcategory, getSubCategory, getSubCategoryByCategory, updateSubCategory, deleteSubcategory } from "../controller/Subcategory.js";

const subCategoryRoutes = express.Router()

subCategoryRoutes.post('/create', Protect, upload.single("image"), createSubcategory)
subCategoryRoutes.get('/subcategory', getSubCategory);
subCategoryRoutes.get('/by-category-name/:categoryName', getSubCategoryByCategory)
subCategoryRoutes.put('/subcategory/:id', Protect, Admin, upload.single("image"), updateSubCategory)
subCategoryRoutes.delete('/subcategory/:id', Protect, Admin, deleteSubcategory)

export default subCategoryRoutes;

