import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../../Header&Footer/Header';
import Navbar from '../../Header&Footer/Navbar';
import Footer from '../../Header&Footer/Footer';

const PrisionersIndexRoute = () => {
    const branch = localStorage.getItem('branch');
    const userType = localStorage.getItem('type');
    const isValidUser = localStorage.getItem("valid") && (branch === 'प्रशासन');

    return (
        <>
            <Header />
            
            {isValidUser ? <Outlet /> : <Navigate to="/" />}
            <Footer />
        </>
    );
};

export default PrisionersIndexRoute;
