import Product from '../Models/ProductDetails.js';
import uploadImageCloudinary from '../Utils/Cloudinary.js';
import * as cloudinary_module from 'cloudinary';
const cloudinary = cloudinary_module.v2;



export const createProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            isPublic

        } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Required Field"
            })
        }
        let images = []
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await uploadImageCloudinary(
                    file.buffer,
                    "Ecommerce/products"
                )
                images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        // Normalize subCategory from form-data
        let sc = subCategory;
        if (typeof sc === 'string') {
            // try to parse JSON (if frontend sent a JSON string)
            try {
                const parsed = JSON.parse(sc);
                if (Array.isArray(parsed)) sc = parsed;
            } catch (e) {
                // not JSON — try comma separated
                if (sc.indexOf(',') !== -1) {
                    sc = sc.split(',').map(s => s.trim()).filter(Boolean);
                } else {
                    // single value string
                    sc = [sc];
                }
            }
        }

        req.body.subCategory = sc;

        const product = await Product.create({
            ...req.body, image: images
        });
        res.status(201).json({
            success: true,
            message: "Product created Successfully",
            data: product
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }
        // Normalize subCategory if sent as string
        if (typeof req.body.subCategory === 'string') {
            try {
                const parsed = JSON.parse(req.body.subCategory);
                if (Array.isArray(parsed)) req.body.subCategory = parsed;
            } catch (e) {
                if (req.body.subCategory.indexOf(',') !== -1) {
                    req.body.subCategory = req.body.subCategory.split(',').map(s => s.trim()).filter(Boolean);
                } else {
                    req.body.subCategory = [req.body.subCategory];
                }
            }
        }

        Object.assign(product, req.body);
        //upload new images
        if (req.files && req.files.length > 0) {
            //delete old images
            for (let img of product.image) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id)
                }
            }
            let newImages = [];

            for (let file of req.files) {
                const result = await uploadImageCloudinary(
                    file.buffer,
                    "Ecommerce/products"
                )
                newImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
            product.image = newImages
        }
        await product.save()
        res.json({
            success: true,
            message: "Product Updated",
            data: product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }
        //delete images from cloudinary
        for (let img of product.image) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id)
            }
        }
        await product.deleteOne()
        res.json({
            success: true,
            message: "Product delete Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export const getProduct = async (req, res) => {
    try {
        let { page = 1, limit = 12, search = "", id, featured } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query = search ? { $text: { $search: search } } : {};
        const skip = (page - 1) * limit;
        if (id) {
            query.subCategory = id;   // 👈 IMPORTANT
        }
        // featured for home
        if (featured === "true") {
            query.isPublic = true;
        }

        const [data, totalCount] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category subCategory"),
            Product.countDocuments(query),
        ]);

        return res.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
    }
};

export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.query;
        console.log("Fetching products for subcategoryId:", id);

        if (!id) {
            return res.status(400).json({
                message: "provide category Id",
                error: true,
                success: false
            })
        }

        const product = await Product.find({ subCategory: { $in: [id] } }).populate("category subCategory")
        console.log("Products found:", product.length);

        return res.json({
            message: "subcategory Product List",
            data: product,
            error: false,
            success: true
        })


    } catch (error) {
        console.error("Error in getProductByCategory:", error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }

}

//get get product by categories product
export const getCategoriesProduct = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.query
        console.log("categoryId", categoryId);

        if (!categoryId) {
            return res.status(400).json({
                message: "Provide categoryId ",
                error: true,
                success: false
            })
        }
        const query = { category: categoryId };
        if (subcategoryId) {
            query.subCategoryId = subcategoryId;
        }
        const product = await Product.find(query)
        return res.json({
            message: "ProductList",
            error: false,
            success: true,
            data: product
        })



    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product id is required",
            });
        }

        const product = await Product.findById(id)
            .populate("category subCategory");
        // console.log("PRODUCT", product);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

