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
import CountPrisionerReport from './Components/Admin/Prisioners/CountReport';
import CountPoliceReport from './Components/Admin/Police/CountReport';
import AashritForm from './Components/Admin/Prisioners/AashritForm';
import PoliceIndexRoute from './Components/Admin/Police/PoliceIndexRoute';
import PrisionersIndexRoute from './Components/Admin/Prisioners/PrisionersIndexRoute';
import DutyMaker from './Components/Admin/Police/DutyMaker';
import PrisionersRecordTable from './Components/Admin/Prisioners/PrisionersRecordTable';
import CommonPrisionersTable from './Components/Admin/Prisioners/CommonPrisionersTable';
import PrisionerReleaseForm from './Components/Admin/Prisioners/PrisionerReleaseForm';


const Nepalidate = new NepaliDate();
const currentDate = Nepalidate.format('YYYY-MM-DD')
const currentTime = Nepalidate.format('HH:mm');

function App() {

  const logout = async () => {
    await handleLogout();
  };

  return (
    <>
      {/* Date:{currentDate}, Time:{currentTime} */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<LogoutButton />} />
          <Route path='/cases' element={<CaseForm />} />


          <Route path='/police' element={<PoliceIndexRoute />}>
            <Route index element={<CountPoliceReport />} />
            <Route path='addpolice' element={<PoliceForm/>}/>
            <Route path='addprisioner' element={<PrisionersForm/>}/>
            {/* <Route path='report' element={<CountPoliceReport />} /> */}
            <Route path='prisioners' element={<CommonPrisionersTable />} />
            <Route path='releaseform' element={<PrisionerReleaseForm />} />
            <Route path='aashrit' element={<AashritForm />} />
          </Route>

          <Route path='/prisioner' element={<PrisionersIndexRoute />}>
            <Route index element={<PrisionersForm />} />
            <Route path='report' element={<CountPrisionerReport />} />
            <Route path='prisioners' element={<CommonPrisionersTable />} />
            <Route path='releaseform' element={<PrisionerReleaseForm />} />
          </Route>
          {/* Temproary Routes */}
          <Route path='/prisioners' element={<CommonPrisionersTable />} />
          <Route path='/dutymaker' element={<DutyMaker />} />
          <Route path='/aashrit' element={<AashritForm />} />
          <Route path='/count' element={<CountPrisionerReport/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
