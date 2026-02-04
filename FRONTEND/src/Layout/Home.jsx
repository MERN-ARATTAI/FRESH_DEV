import React from "react";

import CategoryCart from "../Components/Category";
import BannerImage from "../Components/Banner";
import Product from "../Components/Product";


const Home = () => {
    return (
        <div className="w-full flex flex-col overflow-hidden">



            {/* CATEGORY SLIDER */}
            <div className="w-full bg-white mt-4">
                <CategoryCart />
            </div>

            {/* BANNER */}
            <div className="w-full mt-3 min-h-[60vh] md:min-h-screen">
                <BannerImage />
            </div>

            {/* PERFUME FEATURE SECTION */}
            <div>
                <Product />
            </div>


        </div>
    );
};

export default Home;