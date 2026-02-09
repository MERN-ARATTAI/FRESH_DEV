

import React from 'react'
import Header from '../Components/Header'

import { Outlet } from 'react-router-dom'

import MenzoFooter from '../Components/Footer'


const MainLayout = () => {
    return (
        <>
            <Header />

            <Outlet />
            <MenzoFooter/>
            
        </>


    )
}

export default MainLayout