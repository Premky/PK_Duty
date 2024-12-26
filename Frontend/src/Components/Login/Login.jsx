import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
            case 'सुरक्षा':
                return '/suraksha';
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

    const handleLogin = (event) => {
        event.preventDefault();
        console.log(values)
        axios.post(`${BASE_URL}/auth/login`, values)
            .then(result => {
                if (result.data.loginStatus) {
                    onLogin(result.data)
                    localStorage.setItem("token", result.data.token);
                    localStorage.setItem("valid", true);
                    localStorage.setItem("type", result.data.usertype);
                    localStorage.setItem("branch", result.data.branch);

                    const path = navigateBasedonBranch(result.data.branch);
                    console.log(path)
                    navigate(path);
                } else {
                    setError(result.data.Error)
                }
            }).catch(err => console.log(err))
    }
    return (
        <>
            <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
                <div className='p-3 rounded w-40 border loginForm'>
                    <form onSubmit={handleLogin}>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <TextField id="username" label="Username"
                                onChange={(e) => setValues({ ...values, username: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
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
