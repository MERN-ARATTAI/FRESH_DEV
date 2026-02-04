import express from 'express';
import upload from '../Middleware/Multer.js';
import uploadImage from '../controller/UploadImage.js';
import { Protect } from '../Middleware/User.js';

const UploadRouter = express.Router();

UploadRouter.post('/upload', Protect, upload.single("image"), uploadImage)

export default UploadRouter;