import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
const Api = axios.create({
    baseURL: BASE_URL,
    //  
})
// welocme to the git
Api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default Api

//category
export const getData = async () => {
    const response = await Api.get('/category/get')
    return response.data
}

//register 
export const getRegister = async (data) => {
    const response = await Api.post('/user/register', data)
    // console.log("resPonse", response);

    return response
}
//login
export const getLogin = async (data) => {
    const response = await Api.post('/user/login', data)
    return response
}
//Logout
export const getLogout = async (data) => {
    return await Api.get('/user/logout', { withCredentials: true })
}

//subcategory
export const getsubcategory = async (categoryName) => {
    const response = await Api.get(`/subcategory/by-category-name/${categoryName}`)
    // console.log("resPonse", response);
    return response.data
}

// product by category get
export const getCategoryProduct = async (id) => {
    const response = await Api.get(`/product/get-product-category?id=${id}`)
    console.log("Response", response);

    return response.data
}

// get product by category
export const getProductByCategory = async (id) => {
    const response = await Api.get(`/product/get-product-category?id=${id}`)
    return response.data
}
// get products by categoryId (optionally with subcategoryId)
export const getProductsByCategoryId = async (categoryId, subcategoryId) => {
    const query = subcategoryId ? `?categoryId=${categoryId}&subcategoryId=${subcategoryId}` : `?categoryId=${categoryId}`;
    const response = await Api.get(`/product/get-product-cat-sub${query}`)
    return response.data
}



//getProduct Homepage

export const getProductHomePage = async (id) => {
    const url = id
        ? `/product/list-product?id=${id}`
        : `/product/list-product`;
    const { data } = await Api.get(url);
    return data.data;
}
export const getFeaturedProducts = async () => {
    const { data } = await Api.get(`/product/list-product?featured=true&limit=8`)
    return data.data
}
//get single product by each id
export const getEachProduct = async (id) => {
    const response = await Api.get(`/product/${id}`)
    return response
}
//add to cart 
export const addToCart = async (productId) => {
    const response = await Api.post('/cart/cart', { productId, quantity: 1 }, { withCredentials: true })
    console.log("Add to Cart Response", response);
    return response.data

}


//getCart
export const getCart = async () => {
    const response = await Api.get("/cart/getcart", { withCredentials: true })
    return response.data
}

//updateCartqty
export const updateCartqty = async (cartItemId, quantity) => {
    const response = await Api.put("/cart/updatecart", { cartItemId, quantity }, { withCredentials: true });
    return response.data
}

//removeCartQty
export const removeCartItem = async (cartItemId) => {
    const res = await Api.delete(`/cart/remove/${cartItemId}`, { withCredentials: true });
    return res.data
}
// CREATE ADDRESS
export const postAddress = async (data) => {
    return Api.post(
        "/address",
        data,
        { withCredentials: true }
    );
};

// GET ALL ADDRESSES
export const getAddress = async () => {
    return Api.get(
        "/address",
        { withCredentials: true }
    );
};
// UPDATE ADDRESS
export const updateAddress = async (id, data) => {
    return Api.put(
        `/address/${id}`,
        data,
        { withCredentials: true }
    );
};

// DELETE ADDRESS
export const deleteAddress = async (id) => {
    return Api.delete(
        `/address/${id}`,
        { withCredentials: true }
    );
};
//user auth
export const userAuth = async () => {
    const response = await Api.get("/user/me", { withCredentials: true });
    return response
}

// WISHLIST APIs
export const addToWishlist = async (productId) => {
    const response = await Api.post(
        "/wishlist/add",
        { productId },
        { withCredentials: true }
    );
    return response.data;
};

export const removeFromWishlist = async (productId) => {
    const response = await Api.delete(
        `/wishlist/remove/${productId}`,
        { withCredentials: true }
    );
    return response.data;
};

export const getWishlist = async () => {
    const response = await Api.get(
        "/wishlist",
        { withCredentials: true }
    );
    return response.data;
};

export const checkWishlist = async (productId) => {
    const response = await Api.get(
        `/wishlist/check/${productId}`,
        { withCredentials: true }
    );
    return response.data;
};

export const clearWishlist = async () => {
    const response = await Api.delete(
        "/wishlist/clear",
        { withCredentials: true }
    );
    return response.data;
};