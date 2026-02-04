import React from 'react'
import BannerImage from './Banner'
import Category from './Category'
import Product from './Product';
import Footer from './Footer';
import Banner from './Banner';
const Home = () => {
    return (
        <>
            <Category />
            <Banner />
            {/* <Banner/> */}
            <Product />
            <div className='mt-20'>
                <Footer />
            </div>

        </>
    );
};

export default Home;

