import React from 'react'
import Header from '../Components/Header'
import UsesContext from '../GlobalProvider/UsesContext'
import { Outlet } from 'react-router-dom'
import Product from '../Components/Product'


const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>


    )
}

export default MainLayout