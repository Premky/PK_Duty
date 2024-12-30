import React, { useEffect, useState } from 'react';
import office_image from '../../assets/Office.jpg';
import malelogo1 from '../../assets/Logos/male-icon.png';
import femalelogo from '../../assets/Logos/female-icon.png';
import nogenderlogo from '../../assets/Logos/other-icon.png';
import axios from 'axios';
import Notice_Bolpatra from './Notice_Bolpatra';

const Home = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [color, setColor] = useState('red');
    const [activeTab, setActiveTab] = useState(1);
    const [employee, setEmployee] = useState({ name: '', rank: '', contact: '', email: '', image: '', user_id: localStorage.getItem('uid') });
    const [fetchEmp, setFetchEmp] = useState([]);
    const [office, setOffice] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state
    const [fetchNotice, setFetchNotice]=useState([]);

    const fetchEmployees = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/employee`);
            if (result.data.Status) {
                setFetchEmp(result.data.Result);
            } else {
                console.log(result.data.Result);
            }
        } catch (err) {
            setError("Failed to fetch employees.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficeInfo = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/office`);
            if (result.data.Status) {
                setOffice(result.data.Result[0]);
                // console.log(result.data.Result[0])
            } else {
                console.log(result.data.Result);
            }
        } catch (err) {
            setError("Failed to fetch office info.");
            console.error(err);
        }
    };

    const fetchNotices = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/notices`);
            if (result.data.Status) {
                setFetchNotice(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.log(err);
            alert('Failed to fetch notices. Please try again later.');
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchOfficeInfo();
        fetchNotices();
    }, [BASE_URL]);

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-md-9 col-sm-12">
                    <div className="row b">
                        <div className="col mb-1 mt-0 p-2 bg-danger text-white">
                            <marquee behavior="" direction="" scrollamount="1">
                                सुचना-2 लाई सुचना 5git बनाइएको छ ।
                            </marquee>
                        </div>
                        <div className="col-12">
                            <img src={office_image} alt="Office Building" className="responsive-image" />
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-sm-12 m-0">
                    {loading ? (
                        <p>Loading employees...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        fetchEmp.slice(0,3).map((n, index) => (
                            <div className="card mb-3" key={index}>
                                <div className="row g-0">
                                    <div className="col-sm-6 col-xl-4 p-1">
                                        <img src={n.photo || (n.gender === 'M' ? malelogo1 : n.gender === 'F' ? femalelogo : nogenderlogo)} className='responsive-image' alt="Employee" />
                                    </div>
                                    <div className="col-sm-6 col-xl-7 p-1">
                                        <div className="card-body">
                                            <h5 className="card-title">{n.rank_np_name}</h5>
                                            <p className='card-text p-0 m-1'>{n.name_np}</p>
                                            <p className='card-text p-0 m-1'>{n.contact}</p>
                                            <p className='card-text p-0 m-1'>{n.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="row">
                    <div className="col-md-9 col-sm-12">
                        <hr className='mt-2' />
                        <h2 className='text-center text-danger'><u>परिचय</u></h2>
                        <hr />
                        <p className='fs-5' style={{textAlign:'justify'}}>                            
                            {office ? office.office_np : 'Loading office info...'}
                        </p>
                        <hr />
                    </div>
                    <div className="col-md-3 col-sm-12">
                        <div className="card" style={{ width: "18rem" }}>
                            <div className="card-body bg-primary text-white">
                                <h2 className='text-center'>M</h2>
                            </div>
                        </div>
                        <div className="card" style={{ width: "18rem" }}>
                            <div className="card-body bg-primary text-white">
                                <h2 className='text-center'>सूचनाको हक</h2>
                            </div>
                        </div>

                        {/* <div className="card" style={{ width: "18rem" }}>
                            <div className="card-body bg-primary text-white">
                                <h2 className='text-center'>उजुरी/गुनासो</h2>
                            </div>
                        </div> */}

                    </div>
                </div>
                <div className="row">
                    <Notice_Bolpatra />

                    
                </div>
            </div>
        </div>
    );
};

export default Home;
