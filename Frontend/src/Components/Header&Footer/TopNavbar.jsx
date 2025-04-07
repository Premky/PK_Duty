import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Logout from '../Login/Logout';

function TopNavbar() {
    const [userType, setUserType] = useState(null);
    const [pagesLabel, setPagesLabel] = useState([]);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const type = localStorage.getItem('type');
        setUserType(type);

        if (type === 'Superadmin') {
            setPagesLabel([
                'कैदीबन्दीको संख्या',
                'कैदीबन्दीको नामावली',
                'प्रहरी कर्मचारीको विवरण',
                'कैदीबन्दीको विवरण थप्नुहोस',
                'आश्रितको विवरण थप्नुहोस्',
                'कैदमुक्त'
            ]);
            setPages([
                'police',
                'police/prisoners', // Fixed typo
                'police/addpolice',
                'police/addprisoner', // Fixed typo
                'police/aashrit',
                'police/releaseform'
            ]);
        } else if(type=='User') {
            setPagesLabel([
                'कैदीबन्दीको संख्या',
                'कैदीबन्दीको नामावली',
                'कैदीबन्दीको विवरण थप्नुहोस',
                'आश्रितको विवरण थप्नुहोस्',
                'कैदमुक्त',
                'मास्केबारी'
            ]);
            setPages([
                'police',
                'police/prisoners', 
                'police/addprisoner', 
                'police/aashrit',
                'police/releaseform',
                'count'                
            ]);
        } else if(type) {
            setPagesLabel([
                'कैदीबन्दीको संख्या',
                'कैदीबन्दीको नामावली',
                'कैदीबन्दीको विवरण थप्नुहोस',
                'आश्रितको विवरण थप्नुहोस्',
                'कैदमुक्त',
                'मास्केबारी'
            ]);
            setPages([
                'police',
                'police/prisoners', 
                'police/addprisoner', 
                'police/aashrit',
                'police/releaseform',
                '/count'
            ]);
        }
    }, []);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        {pagesLabel.map((label, index) => (
                            <Button
                                key={label}
                                sx={{ my: 2, color: 'white' }}
                            >
                                <Link to={`/${pages[index]}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {label}
                                </Link>
                            </Button>
                        ))}
                    </Box>

                    <Box>
                        <Logout />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default TopNavbar;
