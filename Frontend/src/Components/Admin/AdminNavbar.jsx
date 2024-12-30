import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Employee from './Employee';
import NoticeForm from './NoticeForm';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const FullWidthTabs = () => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="container-fluid bg-primary p-0 m-0 " style={{width: '100%'}}>
            <div className="row">
                <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="कर्मचारी" {...a11yProps(0)} />
                            <Tab label="सूचना पाटी" {...a11yProps(1)} />
                            <Tab label="प्रकाशनहरु" {...a11yProps(2)} />
                            <Tab label="मिडिया सेन्टर" {...a11yProps(3)} />
                            <Tab label="सम्पर्क" {...a11yProps(4)} />
                            <Tab label="जनगुनासो" {...a11yProps(5)} />
                            {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
                        </Tabs>
                    </AppBar>

                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Employee/>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <NoticeForm/>
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        
                    </TabPanel>
                    <TabPanel value={value} index={4} dir={theme.direction}>
                        
                    </TabPanel>     
                    <TabPanel value={value} index={5} dir={theme.direction}>
                        
                    </TabPanel>                                                         
                </Box>
            </div>
        </div>
    );
}

export default FullWidthTabs;
