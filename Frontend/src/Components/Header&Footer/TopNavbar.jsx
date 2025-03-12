import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

import Logout from '../Login/Logout';
// Pages and their corresponding routes
const pagesLabel = ['कैदीबन्दीको संख्या', 'कैदीबन्दीको नामावली', 'प्रहरी कर्मचारीको विवरण', 'कैदीबन्दीको विवरण थप्नुहोस', 'आश्रितको विवरण थप्नुहोस्', 'कैदमुक्त'];
const pages = ['police', 'police/prisioners', 'police/addpolice', 'police/addprisioner', 'police/aashrit', 'police/releaseform']; // corresponding paths

function TopNavbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

                    {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}> */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        {pagesLabel.map((label, index) => (
                            <Button
                                key={label}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white' }}
                            >
                                {/* Use the 'Link' component for navigation */}
                                {/* Use the 'Link' component for navigation */}
                                <Link to={`/${pages[index]}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {label} {/* Display the readable label */}
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
