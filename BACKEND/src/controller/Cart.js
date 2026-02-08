import CartProduct from "../Models/CartProducDetails.js";
import Product from '../Models/ProductDetails.js';
import UserData from '../Models/PersonDetails.js';

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "product Id is required"
            })
        }
        const product = await Product.findById(productId)
        if (!product || product.public === false) {
            return res.status(404).json({
                success: false,
                message: "product Not found"
            })
        }
        //check already product in cart
        const cartItem = await CartProduct.findOne({
            user: userId,
            product: productId,
            status: "Active"
        });
        //Already exits -> increase quantity
        if (cartItem) {
            cartItem.quantity += quantity;

            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Out of stock"
                });
            }

            cartItem.totalPrice = cartItem.quantity * cartItem.price;
            await cartItem.save();

            return res.json({
                success: true,
                message: "cart Updated",
                data: cartItem
            })
        }
        const newCartItem = await CartProduct.create({
            user: userId,
            product: productId, quantity,
            price: product.price,
            totalPrice: product.price * quantity
        })
        await UserData.findByIdAndUpdate({ _id: userId }, {
            $push: {
                shopping_cart: newCartItem
            }
        })
        return res.status(201).json({
            success: true,
            message: "Product add to cart",
            data: newCartItem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// export const getCartProduct = async (req, res) => {
//     try {
//         const userId = req.user._id
//         // console.log(userId);

//         const cartItems = await CartProduct.find({
//             user: userId,
//             status: "Active"
//         })
//             .populate("product", "name image price stock discount").sort({ createdAt: -1 });
//         const totalAmount = cartItems.reduce((sum, item) => {
//             const price = Number(item.product?.price) || 0;
//             const discount = Number(item.product?.discount) || 0;
//             const quantity = Number(item.quantity) || 1;

//             const discountedPrice = price - (price * discount) / 100;
//             const itemTotal = discountedPrice * quantity;

//             return sum + itemTotal;
//         }, 0);
//         return res.json({
//             success: true,
//             data: cartItems,
//             totalAmount: totalAmount.toFixed(2)
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
export const getCartProduct = async (req, res) => {
    try {
        const userId = req.user._id

        const cartItems = await CartProduct.find({
            user: userId,
            status: "Active"
        })
            .populate("product", "name image price stock discount").sort({ createdAt: -1 });
        
        // Calculate totalPrice for each item and overall totalAmount
        const cartItemsWithTotal = cartItems.map(item => {
            const price = Number(item.product?.price) || 0;
            const discount = Number(item.product?.discount) || 0;
            const quantity = Number(item.quantity) || 1;

            const discountedPrice = price - (price * discount) / 100;
            const totalPrice = discountedPrice * quantity;

            return {
                ...item.toObject(),
                totalPrice: totalPrice.toFixed(2)
            };
        });

        const totalAmount = cartItemsWithTotal.reduce((sum, item) => {
            return sum + Number(item.totalPrice);
        }, 0);

        return res.json({
            success: true,
            data: cartItemsWithTotal,
            totalAmount: totalAmount.toFixed(2)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId, quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must Be at least 1"
            })
        }
        const cartItem = await CartProduct.findOne({
            _id: cartItemId,
            user: userId,
            status: "Active"
        })
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item Not found"
            })
        }
        cartItem.quantity = quantity;
        cartItem.totalPrice = cartItem.quantity * cartItem.price;
        await cartItem.save();

        return res.json({
            success: true,
            message: "Quantity Updated",
            data: cartItem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId } = req.params;
        const deleted = await CartProduct.findOneAndDelete({
            _id: cartItemId,
            user: userId,
            status: "Active"
        });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        return res.json({
            success: true,
            message: "Item removed from cart"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}