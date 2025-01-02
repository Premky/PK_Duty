import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import NepaliDate from 'nepali-datetime'
import Login from './Components/Login/Login';
import PoliceForm from './Components/Admin/Police/PoliceForm';
import LogoutButton from './Components/Login/Logout';
import PrisionersForm from './Components/Admin/Prisioners/PrisionersForm';
import CaseForm from './Components/Admin/OtherRequired/CaseForm';
import CountReport from './Components/Admin/Prisioners/CountReport';
const Nepalidate = new NepaliDate();
const currentDate = Nepalidate.format('YYYY-MM-DD')
const currentTime = Nepalidate.format('HH:mm');

function App() {

  const logout = async () => {
    await handleLogout();
};

  return (
    <>
      Date:{currentDate}, Time:{currentTime}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/logout' element={<LogoutButton/>}/>
          <Route path='/cases' element={<CaseForm/>}/>


          <Route path='/police' element={<PoliceForm/>}/>
          <Route path='/prisioner' element={<PrisionersForm/>}/>

          {/* Temproary Routes */}
          <Route path='/prisioner_report' element={<CountReport/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
