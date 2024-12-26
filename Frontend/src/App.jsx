import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import NepaliDate from 'nepali-datetime'
import Login from './Components/Login/Login';
const Nepalidate = new NepaliDate();
const currentDate = Nepalidate.format('YYYY-MM-DD')
const currentTime = Nepalidate.format('HH:mm');

function App() {


  return (
    <>
      Date:{currentDate}, Time:{currentTime}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
