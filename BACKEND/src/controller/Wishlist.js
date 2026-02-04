import WishlistData from '../Models/WishlistDetails.js';
import Product from '../Models/ProductDetails.js';

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id; // From JWT token

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if product is already in wishlist
        const existingWishlist = await WishlistData.findOne({
            user: userId,
            product: productId
        });

        if (existingWishlist) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        // Add to wishlist
        const wishlist = await WishlistData.create({
            user: userId,
            product: productId
        });

        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            data: wishlist
        });

    } catch (error) {
        console.error("Error in addToWishlist:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const wishlist = await WishlistData.findOneAndDelete({
            user: userId,
            product: productId
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        res.json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {
        console.error("Error in removeFromWishlist:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await WishlistData.find({ user: userId })
            .populate({
                path: 'product',
                select: 'name price image brand description stock'
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Wishlist fetched successfully",
            data: wishlist
        });

    } catch (error) {
        console.error("Error in getUserWishlist:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Clear wishlist on logout
export const clearWishlistOnLogout = async (req, res) => {
    try {
        const userId = req.user._id;

        await WishlistData.deleteMany({ user: userId });

        res.json({
            success: true,
            message: "Wishlist cleared"
        });

    } catch (error) {
        console.error("Error in clearWishlistOnLogout:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Check if product is in wishlist
export const isProductInWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const wishlist = await WishlistData.findOne({
            user: userId,
            product: productId
        });

        res.json({
            success: true,
            data: !!wishlist
        });

    } catch (error) {
        console.error("Error in isProductInWishlist:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
