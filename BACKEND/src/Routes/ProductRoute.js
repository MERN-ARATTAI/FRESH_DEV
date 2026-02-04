import express from 'express';
import uploadImageCloudinary from '../Utils/Cloudinary.js';
import { Protect } from '../Middleware/User.js';
import { Admin } from '../Middleware/Admin.js';
import upload from '../Middleware/Multer.js';
import { createProduct, updateProduct, deleteProduct, getProduct, getProductByCategory, getCategoriesProduct, getSingleProduct } from '../controller/Product.js';

const productRouter = express.Router()

productRouter.post('/create-product', Protect, Admin, upload.array("image", 5), createProduct)
productRouter.put('/update/:id', Protect, Admin, upload.array("image", 5), updateProduct)
productRouter.delete('/delete/:id', Protect, Admin, upload.array("image", 5), deleteProduct)
productRouter.get('/list-product', getProduct)
productRouter.get('/get-product-category', getProductByCategory)
productRouter.get('/get-product-cat-sub', getCategoriesProduct)
productRouter.get("/:id", getSingleProduct);

export default productRouter;
