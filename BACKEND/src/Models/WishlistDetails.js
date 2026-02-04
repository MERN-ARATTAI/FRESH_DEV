import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Person_Details",
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "product_Data",
        required: true
    }
}, { timestamps: true });

// Index to prevent duplicate products per user
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const WishlistData = mongoose.model("Wishlist_Data", wishlistSchema);

export default WishlistData;
