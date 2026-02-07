import React, { useEffect } from 'react'
import { useContext } from 'react'
import { Children } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import {
    getCart, getData, removeCartItem, updateCartqty,
    addToCart, getCategoryProduct, getProductByCategory, getsubcategory,
    getProductHomePage, addToWishlist, removeFromWishlist, getWishlist,
    checkWishlist, clearWishlist, getProductsByCategoryId

} from '../Api/interceptor';
import AxiosToastError from '../Utils/AxiosToastError';
import toast from 'react-hot-toast';

const CartProduct = createContext(null)

const UsesContext = ({ children }) => {



    const [Wishlist, setWishlist] = useState([]);
    const [cartCount, setCartCount] = useState(0)
    const [Category, setCategory] = useState([])
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    // const [homeproduct, setHomeProduct] = useState([]);



    const handleAddToWishlist = async (product) => {
        try {
            const res = await addToWishlist(product._id);
            if (res.success) {
                // Refetch the entire wishlist to get properly populated data
                await fetchWishlist();
                console.log("Product added to wishlist");
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error.message);
        }
    }

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const res = await removeFromWishlist(productId);
            if (res.success) {
                // Refetch the entire wishlist after removing
                await fetchWishlist();
                console.log("Product removed from wishlist");
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error.message);
        }
    }

    const fetchWishlist = async () => {
        try {
            console.log("Fetching wishlist...");
            const res = await getWishlist();
            console.log("Wishlist API response:", res);
            if (res.success) {
                console.log("Wishlist data to set:", res.data);
                setWishlist(res.data || []);
                setWishlistCount(res.data?.length || 0);
                console.log("Wishlist fetched and state updated:", res.data);
            } else {
                console.error("API returned success: false", res);
                setWishlist([]);
            }
        } catch (error) {
            console.error("Error fetching wishlist - Full error:", error);
            console.error("Error message:", error.message);
            console.error("Error response:", error.response?.data);
            setWishlist([]);
        }
    }

    const isProductInWishlist = async (productId) => {
        try {
            const res = await checkWishlist(productId);
            return res.data;
        } catch (error) {
            console.error("Error checking wishlist:", error.message);
            return false;
        }
    }

    const handleClearWishlist = async () => {
        try {
            const res = await clearWishlist();
            if (res.success) {
                setWishlist([]);
                setWishlistCount(0);
                console.log("Wishlist cleared");
            }
        } catch (error) {
            console.error("Error clearing wishlist:", error.message);
        }
    }

    // Local-only clear (DO NOT call server). Use on logout to preserve user's server wishlist.
    const clearWishlistLocal = () => {
        setWishlist([]);
        setWishlistCount(0);
    }

    // Local-only clear for cart state (DO NOT call server). Clears the UI immediately on logout.
    const clearCartLocal = () => {
        setCartItems([]);
        setCartCount(0);
        setTotalAmount(0);
    }

    const addWishlist = (product) => {
        setWishlist((prev) => {
            const exit = prev.find(item => item._id === product._id);
            if (exit) return prev;
            return [...prev, product]
        })
    }

    const removeFromWishlistLocal = (id) => {
        setWishlist(prev => prev.filter(item => item._id !== id))

    }

    //-----------HOME PRODUCT PAGE----------------


    // const HomeProductPage = async (subCategoryId) => {
    //     try {
    //         const res = await getProductHomePage(subCategoryId);
    //         setHomeProduct(res?.data?.data || []); // ✅ IMPORTANT
    //     } catch (error) {
    //         console.log("error", error.message);
    //     }
    // };




    //images in Category Data
    const fetchData = async () => {
        try {
            const responseData = await getData()
            console.log("Categories Response:", responseData);
            if (responseData && responseData.data && Array.isArray(responseData.data)) {
                setCategory(responseData.data)
            } else {
                setCategory([])
                console.warn("No categories data in response")
            }

        } catch (error) {
            console.log("ERROR fetching categories:", error.message)
            setCategory([])
        }
    }
    //cart function controller
    const fetchCart = async () => {
        try {
            const res = await getCart();

            setCartItems(res.data || [])
            setTotalAmount(res.totalAmount || 0)

            // console.log("fetchCart", res);
            // ✅ update global cart count HERE
            // setCartCount(Array.isArray(res.data) ? res.data.length : 0);
            setCartCount(res.data.length)

        } catch (error) {
            AxiosToastError(error)

        }
    }
    const increaseQty = async (item) => {
        await updateCartqty(item._id, item.quantity + 1);
        fetchCart();
    };
    const decreaseQty = async (item) => {
        if (item.quantity === 1) return;
        await updateCartqty(item._id, item.quantity - 1);
        fetchCart();
    }
    const removeItem = async (cartItemId) => {
        try {
            const res = await removeCartItem(cartItemId);

            if (!res.success) return;

            await fetchCart()// 👈 backend truth


        } catch (error) {

        }
    };


    // Fetch products by subcategory ID (called when subcategory is clicked)
    const fetchAllCategoryProducts = async (categoryId) => {
        try {
            console.log("Fetching products for category ID:", categoryId);
            const res = await getProductsByCategoryId(categoryId);
            console.log("Products Response (by category):", res);

            // ✅ Backend returns { success, data: [...] }
            if (res?.success && Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]);
                console.warn("No products data in response (by category)");
            }
        } catch (error) {
            console.error("Error fetching category products:", error.message);
            setProducts([]);
        }
    };
    const fetchProductsBySubcategory = async (subCategoryId) => {
        try {
            console.log("Fetching products for subcategory:", subCategoryId);
            const res = await getProductByCategory(subCategoryId);
            console.log("Products Response (by subcategory):", res);

            if (res?.success && Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]);
                console.warn("No products data in response (by subcategory)");
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
            setProducts([]);
        }
    };
    // Fetch subcategories for the left side
    const fetchSubCategories = async (categoryName) => {
        try {
            console.log("Fetching subcategories for category:", categoryName);
            const res = await getsubcategory(categoryName);
            console.log("Subcategories Response:", res);
            if (res && res.data && Array.isArray(res.data)) {
                setSubCategories(res.data || []);
                // Clear products when fetching new subcategories

            } else {
                setSubCategories([]);
                console.warn("No subcategories data in response");
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error.message);
            setSubCategories([]);
        }
    };


    const handleAddToCart = async (productId) => {
        try {
            const res = await addToCart(productId);
            if (!res.success) {
                AxiosToastError(res.message);
                return;
            }
            // Refresh cart from backend so cartItems, totalAmount and cartCount stay consistent
            await fetchCart();
            toast.success(res.message || 'Added to cart');
        } catch (error) {
            AxiosToastError(error);
        }
    };






    useEffect(() => {
        fetchData()
        fetchCart()
        fetchWishlist()


    }, [])


    return (
        <CartProduct.Provider
            value={{
                Wishlist,
                Category,
                cartItems,
                cartCount,
                totalAmount,
                products,
                subCategories,
                wishlistCount,
                // homeproduct,
                setCartCount,
                fetchCart,


                addWishlist,
                removeFromWishlistLocal,
                handleAddToCart,
                increaseQty,
                decreaseQty,
                removeItem,

                fetchAllCategoryProducts,
                fetchProductsBySubcategory,
                fetchSubCategories,

                // Wishlist methods
                handleAddToWishlist,
                handleRemoveFromWishlist,
                fetchWishlist,
                isProductInWishlist,
                handleClearWishlist,
                clearWishlistLocal,
                clearCartLocal,
                // HomeProductPage


            }}>
            {children}
        </CartProduct.Provider>
    )
}

export default UsesContext

export const useAll = () => {
    const data = useContext(CartProduct)
    if (!data) {
        throw new Error("useAll Must BE used INside Add Cart Provider")
    }
    return data
}