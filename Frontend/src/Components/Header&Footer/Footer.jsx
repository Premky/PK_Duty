
import React from 'react';
import { Link } from 'react-router-dom';
import SimpleMap from '../Client/Map';
import { Box, Grid2 } from '@mui/material';

const Footer = () => {
    return (
        <>
            <Box bgcolor={"#3f51b5"} color={"#fff"} p={2} >
                <Grid2 container spacing={2} justifyContent="center" alignItems="center">
                    <Grid2 item>
                        <Link to="/about" className="text-white">About Us</Link>
                    </Grid2>
                    <Grid2 item>
                        <Link to="/contact" className="text-white">Contact Us</Link>
                    </Grid2>
                    </Grid2>
            </Box>
            <div className="container-fluid bg-primary text-white">
                <div className="row m-2 p-2">
                    <div className="col-md-3 col-sm-6 col-xs-12 m-0 p-0">
                        <h4>सम्पर्क ठेगाना</h4>
                        <p>खाँदवारी, सङ्‍खुवासभा</p>
                        <p>+977-9852070777</p>
                        <p>029-562180</p>
                        <p>sankhuwasava.jailor@dopm.gov.np</p>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12 m-0 p-0">
                        <h4>लिङ्क</h4>
                        <p>सुचनाको हक</p>
                        <p>उजुरी/गुनासो</p>
                        <p>प्रधानमन्त्री कार्यालय</p>
                        <p>राष्ट्रिय सुचना आयोग</p>
                        <p>राष्ट्रिय किताबखाना (निजामती)</p>
                        <p>सर्वोच्च अदालत</p>
                        <p>राष्ट्रिय सूचना प्रविधि केन्द्र</p>
                    </div>
                    <div className="col-md-6 col-sm-12 m-0 p-0">
                        <h4>कार्यालय स्थान</h4>
                        <div className="row">
                            <div className="col">
                                <SimpleMap />
                            </div>
                        </div>
                        <div className="row">


                            <div className="row mt-2">
                                <Link to="/admin/" className="text-white">Go to Admin</Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>


    );
};

export default Footer;
