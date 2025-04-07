
import React from 'react';
import { Link } from 'react-router-dom';
import SimpleMap from '../Client/Map';
import { Box, Grid2 } from '@mui/material';

const Footer = () => {
    return (
        <>
            <Box p={2} className="bg-primary text-white" >
                <Grid2 container spacing={2}  >
                    <Grid2 item size={{ xs: 12, sm: 6, md: 4 }}>
                        <h5 alignItems="center">सम्पर्क ठेगाना</h5>
                        <p>खाँदवारी, सङ्‍खुवासभा</p>
                        <p>+977-9852070777</p>
                        <p>029-562180</p>
                        <p>sankhuwasava.jailor@dopm.gov.np</p>
                        <p>भेटघाट समय: १०ः३० - ०३ः००</p>
                        
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 6, md: 4 }} className="">
                        <h5>लिङ्क</h5>
                        <p>सुचनाको हक</p>

                        <p>
                            <Link to="#" target="_blank" rel="noopener noreferrer" underline="hover"
                             className="text-white text-decoration-none">
                                उजुरी/गुनासो
                            </Link>
                        </p>
                        <p>
                            <Link to="https://www.opmcm.gov.np/" target="_blank" rel="noopener noreferrer" underline="hover"
                             className="text-white text-decoration-none">
                                प्रधानमन्त्री कार्यालय
                            </Link>
                        </p>
                        <p>
                            <Link to="https://nic.gov.np/" target="_blank" rel="noopener noreferrer" underline="hover"
                             className="text-white text-decoration-none">
                                राष्ट्रिय सुचना आयोग
                            </Link>
                        </p>
                        <p>
                            <Link to="https://pis.gov.np/" target="_blank" rel="noopener noreferrer" underline="hover"
                             className="text-white text-decoration-none">
                                राष्ट्रिय किताबखाना (निजामती)
                            </Link>
                        </p>
                        <p>
                            <Link to="https://supremecourt.gov.np/" target="_blank" rel="noopener noreferrer" underline="hover"
                             className="text-white text-decoration-none">
                                सर्वोच्च अदालत
                            </Link>
                        </p>
                        <p>
                            <Link to="https://idmc.gov.np/" target="_blank" rel="noopener noreferrer" underline="hover"
                             className="text-white text-decoration-none">
                                राष्ट्रिय सूचना प्रविधि केन्द्र
                            </Link>
                        </p>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                typography: 'body1',
                                '& > :not(style) ~ :not(style)': {
                                    ml: 2,
                                },
                            }}
                        >
                            <Link href="#" underline="none">
                                {'underline="none"'}
                            </Link>
                            <Link href="#" underline="hover">
                                <p>dfa</p>
                            </Link>
                            <Link href="#" underline="always">
                                {'underline="always"'}
                            </Link>
                        </Box>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 6, md: 4 }}>
                        <Grid2 container spacing={2} justifyContent="center">
                            <SimpleMap />
                            <Link to="/login/" className="text-white">Go to Admin</Link>
                            <Box>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Box>
            <div className="container-fluid bg-primary text-white">

            </div>
        </>


    );
};

export default Footer;
