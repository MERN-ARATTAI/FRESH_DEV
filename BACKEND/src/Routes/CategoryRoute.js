import express from 'express';
import upload from '../Middleware/Multer.js';
import { Protect } from '../Middleware/User.js';
import { Admin } from '../Middleware/Admin.js';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controller/Category.js';

const categoryRouter = express.Router()

categoryRouter.post('/create', Protect, Admin, upload.single("image"), createCategory)
categoryRouter.put('/update/:id', Protect, Admin, upload.single("image"), updateCategory)
categoryRouter.delete('/delete/:id', Protect, Admin, upload.single("image"), deleteCategory)
categoryRouter.get('/get', getCategories)

export default categoryRouter; 