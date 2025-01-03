import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../../Header&Footer/Header';
import Navbar from '../../Header&Footer/Navbar';
import Footer from '../../Header&Footer/Footer';

const PoliceIndexRoute = () => {
    const branch = localStorage.getItem('branch');
    const userType = localStorage.getItem('type');
    const isValidUser = localStorage.getItem("valid") && (branch === 'प्रहरी');

    return (
        <>
            <Header />            
            {isValidUser ? <Outlet /> : <Navigate to="/" />}
            <Footer />
        </>
    );
};

export default PoliceIndexRoute;
