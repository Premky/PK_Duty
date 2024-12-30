import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'

//Items from Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button } from '@mui/material';
//Close Item from MaterialUI

// import './LoginStyle.css'

const Login = (onLogin) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();

    const branch = localStorage.getItem("branch")

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const navigateBasedonBranch = (branch) => {
        switch (branch) {
            case 'सुपरएडमिन':
                return '/superadmin';
            case 'प्रहरी':
                return '/police';
            default:
                return '/';
        }
    };

    if (branch) {
        navigateBasedonBranch(branch)
    }

    const [values, setValues] = useState({
        username: '',
        password: '',
        // usertype: '',
        // branch: '',
    })

    const [error, setError] = useState();
    // axios.defaults.withCredentials = true;

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, values, {withCredentials:true});

            if (response.data.loginStatus) {
                // Save necessary data in localStorage
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("valid", true);
                localStorage.setItem("type", response.data.usertype);
                localStorage.setItem("branch", response.data.branch);
                localStorage.setItem("office_np", response.data.office_np);
                localStorage.setItem("office_id", response.data.office_id);
    
                // Determine navigation path based on branch
                const path = navigateBasedonBranch(response.data.branch);
                console.log(response.data);
                console.log("Navigating to:", path);
                navigate(path);
                // navigate('police'); //Manual Path
            } else {
                setError(response.data.Error);
            }
        } catch (err) {
            console.error("Login Error:", err);
            const errorMessage =
                err.response?.data?.Error || "An unexpected error occurred.";
            setError(errorMessage);
        }
    };
    

    return (
        <>
            <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
                <div className='p-3 rounded w-40 border loginForm'>
                    <form onSubmit={handleLogin} >
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" >
                            <TextField id="username" label="Username"
                                onChange={(e) => setValues({ ...values, username: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </FormControl>
                        <br />
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" >
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            <div style={{color:'red'}}>
                                {error}
                            </div>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <Button variant="contained" type='submit'>Login</Button>
                            </FormControl>
                        </FormControl>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
