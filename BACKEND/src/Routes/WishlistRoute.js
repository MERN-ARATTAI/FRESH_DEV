import express from 'express';
import {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    clearWishlistOnLogout,
    isProductInWishlist
} from '../controller/Wishlist.js';
import { Protect } from '../Middleware/User.js';

const wishlistRouter = express.Router();

// Protected routes - require JWT token
wishlistRouter.post('/add', Protect, addToWishlist);
wishlistRouter.delete('/remove/:productId', Protect, removeFromWishlist);
wishlistRouter.get('/', Protect, getUserWishlist);
wishlistRouter.delete('/clear', Protect, clearWishlistOnLogout);
wishlistRouter.get('/check/:productId', Protect, isProductInWishlist);

export default wishlistRouter;
