import React, { useEffect, useState } from 'react';
import office_image from '../../assets/Office.jpg';
import malelogo1 from '../../assets/Logos/male-icon.png';
import femalelogo from '../../assets/Logos/female-icon.png';
import nogenderlogo from '../../assets/Logos/other-icon.png';
import axios from 'axios';
import Notice_Bolpatra from './Notice_Bolpatra';
import { Box, Grid2 } from '@mui/material';
import AboutOfficeCard from './Utils/AboutOfficeCard';
import ActionAreaCard from '../ReusableComponents/ActionAreaCard';
import { Link } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
import ForumIcon from '@mui/icons-material/Forum';

const Home = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [color, setColor] = useState('red');
    const [activeTab, setActiveTab] = useState(1);
    const [employee, setEmployee] = useState({ name: '', rank: '', contact: '', email: '', image: '', user_id: localStorage.getItem('uid') });
    const [fetchEmp, setFetchEmp] = useState([]);
    const [office, setOffice] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state
    const [fetchNotice, setFetchNotice] = useState([]);

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
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={1}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                        <Box sx={{ p: 2, }}>
                            <Grid2 container spacing={1} >
                                <Grid2 item sx={{ backgroundColor: 'red', color: 'white', p: 1, borderRadius: 2 }}
                                    size={{ sm: 1 }} textAlign={'center'}>
                                    सुचनाः
                                </Grid2>
                                <Grid2 item size={{ sm: 11 }} textAlign={'center'} borderColor='grey.500' sx={{borderTop:1, borderBottom:1}}>
                                    <marquee behavior="" direction="" scrollamount="1">
                                        सुचना-2 लाई सुचना 5git बनाइएको छ ।
                                    </marquee>
                                </Grid2>
                            </Grid2>
                        </Box>

                        {/* Image Container */}
                        <Box sx={{
                            p: 2,

                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <img
                                src={office_image}
                                alt="Office Building"
                                style={{
                                    width: "100%",   // Makes image responsive to the Grid
                                    height: "auto",  // Maintains aspect ratio
                                    maxHeight: "300px", // Prevents stretching beyond 520px
                                    objectFit: "cover" // Ensures the image fits neatly
                                }}
                            />
                        </Box>
                    </Grid2>

                    {/* Right Side ko Grid */}
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 12 }}>
                            <Grid2 container sx={{ p: 2 }}>
                                {loading ? (<p>Loading employees...</p>) : error ? (<p>{error}</p>) : (
                                    fetchEmp.slice(0, 3).map((n, index) => (
                                        <>
                                            <Grid2 size={{ sm: 6, md: 3 }}>
                                                <img src={n.photo || (n.gender === 'M' ? malelogo1 : n.gender === 'F' ? femalelogo : nogenderlogo)}
                                                    style={{
                                                        width: "100%",   // Makes image responsive to the Grid
                                                        height: "auto",  // Maintains aspect ratio
                                                        // minHeight: "100px", // Prevents stretching beyond 100px
                                                        maxHeight: "250px", // Prevents stretching beyond 520px
                                                        objectFit: "cover" // Ensures the image fits neatly
                                                    }}
                                                    alt={n.name_np} />
                                            </Grid2>

                                            <Grid2 size={{ sm: 6, md: 9 }} sx={{ p: 1 }}>
                                                <h6 style={{ color: 'red' }}>{n.rank_np_name}</h6>
                                                <p className='card-text p-0 m-1'>{n.name_np}({n.contact})</p>
                                                <p className='card-text p-0 m-1'>{n.email}</p>
                                            </Grid2>
                                        </>
                                    ))
                                )}
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>

                <Grid2 container spacing={1}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                        <Box sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <AboutOfficeCard info={office ? office.office_detail_np : 'Loading office info...'} />
                        </Box>
                    </Grid2>

                    {/* Right Side ko Grid */}
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 12 }}>
                            <Grid2 container sx={{ bgcolor: 'background.paper' }}>
                                <>
                                    <Grid2 size={{ sm: 5 }} sx={{ m: 1 }}>
                                        <Link to='https://mail.nepal.gov.np/'>
                                            <ActionAreaCard title={'@'} info={'ईमेल'} />
                                        </Link>
                                    </Grid2>

                                    <Grid2 size={{ sm: 5 }} sx={{ m: 1 }}>
                                        <Link to='/self-publications'>
                                            <ActionAreaCard title={<CampaignIcon fontSize='large' />} info={'सूचनाको हक'} />
                                        </Link>
                                    </Grid2>

                                    <Grid2 size={{ sm: 5 }} sx={{ m: 1 }}>
                                        <Link to='/feedback'>
                                            <ActionAreaCard title={<ForumIcon fontSize='large' />} info={'उजुरी/गुनासो'} />
                                        </Link>
                                    </Grid2>
                                </>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>

                <Grid2 container spacing={1}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                        <Notice_Bolpatra />
                    </Grid2>

                    {/* Right Side ko Grid */}
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 12 }}>
                            <Grid2 container sx={{ bgcolor: 'background.paper' }}>


                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Box>
        </>
    );
};

export default Home;
