import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEachProduct } from "../Api/interceptor";
import AxiosToastError from "../Utils/AxiosToastError";
import toast from 'react-hot-toast';
import { useAll } from "../GlobalProvider/UsesContext";
import { useAuth } from "../GlobalProvider/AuthContext";

const ProductDetail = () => {
    const { id } = useParams();
    const { cartItems, handleAddToCart } = useAll()
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [product, setProduct] = useState(null);
    const [mainImg, setMainImg] = useState("");
    const [loading, setLoading] = useState(true);



    const getDeliveryDates = (days = 3) => {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + days);

        const options = { day: "2-digit", month: "short", year: "numeric" };

        return {
            startDate: start.toLocaleDateString("en-IN", options),
            endDate: end.toLocaleDateString("en-IN", options),
        };
    };
    const { startDate, endDate } = getDeliveryDates(3);

    const getSingleProduct = async () => {
        try {
            const res = await getEachProduct(id);
            setProduct(res.data.data);
            setMainImg(res.data.data.image?.[0]?.url);
        } catch (error) {
            AxiosToastError(error);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, [id]);



    // Handle Add to Cart
    const addToCartHandler = async () => {
        if (!isLoggedIn()) {
            toast.error('Please login to add items to cart');
            navigate('/');
            return;
        }

        await handleAddToCart(product._id);
    };



    const handleBuyNow = () => {
        if (!isLoggedIn()) {
            toast.error("Please login to continue");
            navigate(<Login />, { state: { from: `/checkout/${id}` } });
            return;
        }

        navigate(`/checkout/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-12">

            {/* LEFT: IMAGE SECTION */}
            <div className="flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <img
                        src={mainImg}
                        alt={product?.name}
                        className="w-[350px] h-[450px] object-contain"
                    />
                </div>
            </div>

            {/* RIGHT: PRODUCT DETAILS */}
            <div className="space-y-4">

                <h1 className="text-2xl font-semibold">
                    {product?.name}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-2">
                    <div className="flex text-green-500">
                        ★★★★★
                    </div>
                    <span className="text-gray-500 text-sm">(367 reviews)</span>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold text-gray-900">
                    ₹ {product?.price}
                </p>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        In Stock
                    </span>
                </div>

                {/* Quantity counter */}
                <div className="flex items-center gap-2 mt-4">


                    <button
                        onClick={() => addToCartHandler()}
                        className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-2 ml-4 rounded font-semibold transition duration-200"
                    >
                        Add to cart
                    </button>
                </div>

                {/* Buy Now */}
                <button
                    onClick={handleBuyNow}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold mt-4 transition duration-200 transform hover:scale-105"
                >
                    Buy it now
                </button>

                {/* Delivery Info */}
                <div className="bg-green-100 p-4 rounded mt-6 text-sm">
                    <p className="font-medium">
                        Expected delivery between <b>{startDate}</b> and <b>{endDate}</b>
                    </p>

                    <div className="flex justify-between mt-3 text-center">
                        <div>
                            <p className="font-semibold">Purchased</p>
                            <p>{startDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Processing</p>
                            <p>{startDate}-{endDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Delivered</p>
                            <p>{endDate}</p>
                        </div>
                    </div>
                </div>

                {/* Product Description (if available) */}
                {product?.description && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-2">Product Description</h3>
                        <p className="text-gray-700 leading-relaxed">{product?.description}</p>
                    </div>
                )}



            </div>
        </div>
    );
};

export default ProductDetail;



