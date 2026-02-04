import uploadImageCloudinary from '../Utils/Cloudinary.js';

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file Uploaded",
                success: false
            })
        }
        const buffer = req.file.buffer;
        const uploadedImage = await uploadImageCloudinary(buffer, "Products");

        return res.json({
            message: "Uploade_Done",
            data: {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            },
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });

    }
}

export default uploadImage;