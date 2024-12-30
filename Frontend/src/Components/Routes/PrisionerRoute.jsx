import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrisionerRoute = () => {
    const branch = localStorage.getItem('branch');
    const userType = localStorage.getItem('branch');
    // console.log(userType)
    const isValidUser = localStorage.getItem("valid") && (branch === 'ट्राफिक');
    return isValidUser ? <Outlet /> : <Navigate to="/" />;
};

export default PrisionerRoute;
