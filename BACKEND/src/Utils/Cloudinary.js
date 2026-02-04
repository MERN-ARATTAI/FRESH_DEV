import * as cloudinary_module from 'cloudinary';
const cloudinary = cloudinary_module.v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
})

// console.log("cloud_name", process.env.CLOUD_NAME,
//     "api_key:", process.env.CLOUD_API_KEY,
//     " api_secret:", process.env.CLOUD_API_SECRET_KEY
// )

const uploadImageCloudinary = (buffer, folder = 'Ecommerce') => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result)
        }).end(buffer)

    })
}

export default uploadImageCloudinary;
