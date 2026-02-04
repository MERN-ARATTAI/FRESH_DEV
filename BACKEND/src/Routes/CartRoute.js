import express from 'express';
import { Protect } from '../Middleware/User.js';
import { addToCart, getCartProduct, updateCartQuantity, removeCartItem } from '../controller/Cart.js';
// const CartProduct = require('../Models/CartProducDetails')

const CartRoute = express.Router()

CartRoute.post('/cart', Protect, addToCart)
CartRoute.get('/getcart', Protect, getCartProduct)
CartRoute.put('/updatecart', Protect, updateCartQuantity)
CartRoute.delete('/remove/:cartItemId', Protect, removeCartItem)

export default CartRoute;