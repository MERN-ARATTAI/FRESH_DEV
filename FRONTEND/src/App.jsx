

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BannerImage from './Components/Banner'
import CategoryCart from './Components/Category'
import toast, { Toaster } from 'react-hot-toast';

import MainLayout from './Layout/MainLayout'

import CategoryProduct from './Pages/CategoryProduct';
import CartPage from './Pages/CartPage';
import ProductsPage from './Pages/Product_Page';
import ContactPage from './Pages/ContactPage'
import UsesContext from './GlobalProvider/UsesContext';

import ProductDetail from './Pages/ProductDetail';
import PlaceOrderPage from './Pages/PlaceOrderPage';
import OrderSuccessPage from './Pages/OrderSuccessPage';
import MyOrders from './Pages/MyOrders';
import OrderDetails from './Pages/OrderDetails';
import CheckoutPage from './Pages/CheckoutPage';

import Home from './Layout/Home';
import AboutPage from './Pages/AboutPage';
import AddressPage from './Pages/AdressPage';

import WishListPage from "./Pages/WishListPage"




function App() {


  return (

    <>
      <UsesContext>
        <Routes>

          {/* MAIN LAYOUT */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path="/Product_Page" element={<ProductsPage />} />
            <Route path="/category/:categoryName/:id" element={<CategoryProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/pages/cartPage" element={<CartPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/pages/address" element={<AddressPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/place-order" element={<PlaceOrderPage />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/pages/WishListPage" element={<WishListPage />} />
            {/* <Route path="/pages/address" element={<CheckoutPage />} /> */}
          </Route>

          {/* ADMIN */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboasrd />} /> */}

        </Routes>
      </UsesContext>

      <Toaster />
    </>

  )
}

export default App
