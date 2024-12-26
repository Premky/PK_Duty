import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const Logout = (onLogout) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("valid");
    localStorage.removeItem("type");
    localStorage.removeItem("user");
    localStorage.removeItem("uid");
    localStorage.removeItem("oid")
    localStorage.removeItem("bid")

    // onLogout()
    navigate('/login')
  }

  return (
    <div className=''
      onClick={handleLogout}
    >
      Logout</div>
  )
}

export default Logout