import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import TopNavbar from './TopNavbar'

const Combined = () => {
    const branch = localStorage.getItem('branch');
    const userType = localStorage.getItem('type');
    // const isValidUser = localStorage.getItem("valid") && (branch === 'प्रहरी');
    const isValidUser = 'true';
    return (
        <div>
            <Header />
                {isValidUser ? <TopNavbar /> : <></>}
                {/* <TopNavbar /> */}
                {isValidUser ? <Outlet /> : <Navigate to="/login" />}
            <Footer />
        </div>
    )
}

export default Combined
