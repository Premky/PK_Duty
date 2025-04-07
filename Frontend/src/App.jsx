import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import NepaliDate from 'nepali-datetime'
// import Login from './Components/Login/Login';
// import PoliceForm from './Components/Admin/Police/PoliceForm';
// import LogoutButton from './Components/Login/Logout';
// import PrisionersForm from './Components/Admin/Prisioners/PrisionersForm';
// import CaseForm from './Components/Admin/OtherRequired/CaseForm';
// import CountPrisionerReport from './Components/Admin/Prisioners/CountReport';
// import CountPoliceReport from './Components/Admin/Police/CountReport';
// import AashritForm from './Components/Admin/Prisioners/AashritForm';
// import PoliceIndexRoute from './Components/Admin/Police/PoliceIndexRoute';
// import PrisionersIndexRoute from './Components/Admin/Prisioners/PrisionersIndexRoute';
// import DutyMaker from './Components/Admin/Police/DutyMaker';
// import PrisionersRecordTable from './Components/Admin/Prisioners/PrisionersRecordTable';
// import CommonPrisionersTable from './Components/Admin/Prisioners/CommonPrisionersTable';
// import PrisionerReleaseForm from './Components/Admin/Prisioners/PrisionerReleaseForm';

const Login = React.lazy(() => import('./Components/Login/Login'));
const PoliceForm = React.lazy(() => import('./Components/Admin/Police/PoliceForm'));
const LogoutButton = React.lazy(() => import('./Components/Login/Logout'));
const PrisionersForm = React.lazy(() => import('./Components/Admin/Prisioners/PrisionersForm'));
const CaseForm = React.lazy(() => import('./Components/Admin/OtherRequired/CaseForm'));
const CountPrisionerReport = React.lazy(() => import('./Components/Admin/Prisioners/CountReport'));
const CountPoliceReport = React.lazy(() => import('./Components/Admin/Police/CountReport'));
const AashritForm = React.lazy(() => import('./Components/Admin/Prisioners/AashritForm'));
const PoliceIndexRoute = React.lazy(() => import('./Components/Admin/Police/PoliceIndexRoute'));
const PrisionersIndexRoute = React.lazy(() => import('./Components/Admin/Prisioners/PrisionersIndexRoute'));
const DutyMaker = React.lazy(() => import('./Components/Admin/Police/DutyMaker'));
const PrisionersRecordTable = React.lazy(() => import('./Components/Admin/Prisioners/PrisionersRecordTable'));
const CommonPrisionersTable = React.lazy(() => import('./Components/Admin/Prisioners/CommonPrisionersTable'));
const PrisionerReleaseForm = React.lazy(() => import('./Components/Admin/Prisioners/PrisionerReleaseForm'));
import TopNavbar from './Components/Header&Footer/TopNavbar';
import Combined from './Components/Header&Footer/Combined';
import CaseDetails from './Components/Admin/OtherRequired/CaseDetails';
import Home from './Components/Client/Home';

const Nepalidate = new NepaliDate();
const currentDate = Nepalidate.format('YYYY-MM-DD')
const currentTime = Nepalidate.format('HH:mm');

function App() {

  const logout = async () => {
    await handleLogout();
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Date:{currentDate}, Time:{currentTime} */}
        <BrowserRouter>
          <Routes>
            {/* <Route path='/' element={<Login />} /> */}
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<LogoutButton />} />
            <Route path='/cases' element={<CaseForm />} />

            <Route path='/' element={<Combined />} >

              <Route path='/' element={<Home />} />
              <Route path='/police' >
                <Route index element={<CountPoliceReport />} />
                <Route path='addpolice' element={<PoliceForm />} />
                <Route path='addprisoner' element={<PrisionersForm />} />
                {/* <Route path='report' element={<CountPoliceReport />} /> */}
                <Route path='prisoners' element={<CommonPrisionersTable />} />
                <Route path='releaseform' element={<PrisionerReleaseForm />} />
                <Route path='aashrit' element={<AashritForm />} />

                <Route path='details/:caseName' element={<CommonPrisionersTable />} />
                <Route path='details/:caseName/:type' element={<CommonPrisionersTable />} />
                {/* <Route path='details/:type' element={<CommonPrisionersTable />} /> */}
              </Route>
              <Route path='/prisoners' element={<PrisionersForm />}>
                {/* <Route index element={<PrisionersForm />} /> */}
                <Route path='report' element={<CountPrisionerReport />} />
                <Route path='prisoners' element={<CommonPrisionersTable />} />
                <Route path='releaseform' element={<PrisionerReleaseForm />} />
              </Route>

              <Route path='/count' element={<CountPrisionerReport />} />
            </Route>


            {/* Temproary Routes */}
            <Route path='/prisioners' element={<CommonPrisionersTable />} />
            <Route path='/dutymaker' element={<DutyMaker />} />
            <Route path='/aashrit' element={<AashritForm />} />
            
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  )
}

export default App
