import { useTheme } from '@emotion/react'
import axios from 'axios'
import React, { useEffect, useState, useTransition } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import NepaliDate from 'nepali-datetime'
// import Select from 'react-select';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button,
    FormControl, Container, Select, InputLabel,
    MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import PoliceRecordTable from './PoliceRecordTable';
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'

const PoliceForm = () => {
    const currentofficeid = localStorage.getItem('office_id')
    const currentofficenp = localStorage.getItem('office_np')
    console.log(currentofficeid, currentofficenp);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);
    const [ranks, setRanks] = useState([]);
    const [selectedRank, setSelectedRank] = useState('');

    const [records, setRecords] = useState([]); //Holds the records added or fetched for editing;

    const fetchRank = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/police/ranks`);
            const { Status, Result, Error } = response.data;

            if (Status && Result?.length > 0) {
                setRanks(Result);
            } else {
                alert(Error || 'Failed to fetch news data.');
            }
        } catch (error) {
            console.error('Error fetching delete news:', error);
            alert('An error occurred while fetching news data. Please try again.');
        }
    };

    const onFormSubmit = async (data) => {
        // setLoading(true);
        startTransition(async () => {
            // console.log(data)
            try {
                // const formData = new FormData();
                const url = editing ? `${BASE_URL}/police/update_police/${currentData.id}` : `${BASE_URL}/police/add_police`;
                const method = editing ? 'PUT' : 'POST';
                const result = await axios({ method, url, data, withCredentials: true })

                if (result.data.Status) {
                    alert(`Record ${editing ? 'updated' : 'added'} ${result.data.id} successfully!`);
                    reset();
                    setEditing(false);
                    setCurrentData(null);
                    fetchRecords();
                }

            } catch (err) {
                console.error(err);
                alert('Failed to save.')
            }
        })
    };

    const fetchRecords = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/police/get_police_records`);
            const { Status, Result, Error } = response.data;

            if (Status && Result?.length > 0) {
                setRecords(Result); //Set the fetched Records
            } else {
                alert(Error || 'Failed to fetch records.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            alert('An error occured while fetching records.');
        }
    };

    const handleEdit = (record) => {
        setCurrentData(record);
        setEditing(true);
        setValue('name_np', record.name_np);
        setValue('name_en', record.name_en);
        setValue('address', record.address);
        setValue('darbandi', record.darbandi);
        setValue('pmis', record.pmis);
        setValue('sanket', record.sanket);
        setValue('working_from', record.working_from);
        setValue('contact', record.contact);
        setValue('blood_group', record.blood_group);
        setValue('dob', record.dob);
        setValue('gender', record.gender);
        setValue('bp', record.bp);
        setValue('height', record.height);
        setValue('weight', record.weight);
        setValue('is_active', record.is_active);
    };

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`${BASE_URL}/police/delete_police/${id}`);
            if (result.data.Status) {
                alert('Record deleted successfully.');
                fetchRecords(); // Refresh the record list after deletion
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete record.');
        }
    };

    useEffect(() => {
        // handleLogin();
        fetchRank();
        fetchRecords();
    }, [])

    // const actionRank = useActionState(fetchRank);
    return (
        <React.Fragment>
            <div className="col-12">
                <div className="d-flex flex-column px-3 pt-0">
                    <form className="row mt-1 g-3">
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={4} >
                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.rank}>
                                        <InputLabel id="rank_id">दर्जा</InputLabel>
                                        <Select
                                            labelId="rank-label"
                                            id="rank_id"
                                            value={selectedRank}
                                            {...register('rank_id', { required: "This field is required." })}
                                            onChange={(e) => setSelectedRank(e.target.value)}
                                            autoWidth
                                            label="दर्जा"
                                        >
                                            <MenuItem value="" disabled><em>दर्जा</em></MenuItem>
                                            {ranks.map((ranks) => (
                                                <MenuItem value={ranks.id} key={ranks.id}>{ranks.rank_np}</MenuItem>
                                            ))}
                                        </Select>
                                        {/* {errors.rank && <p style={{ color: 'red' }}>{errors.rank.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }} error={!!errors.name_np}>
                                        <TextField
                                            id="name_np"
                                            label="नाम नेपालीमा"
                                            {...register('name_np', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_np}
                                        />
                                        {/* {errors.name_np && <p style={{ color: 'red' }}>{errors.name_np.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }} >
                                        <TextField
                                            id="name_en"
                                            label="नाम (अंग्रेजीमा)"
                                            {...register('name_en', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_en}
                                        />
                                        {/* {errors.name_en && <p style={{ color: 'red' }}>{errors.name_en.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="address" label="ठेगाना"
                                            {...register('address', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.address}
                                        />
                                        {/* {errors.address && <p style={{ color: 'red' }}>{errors.address.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="darbandi" label="दरबन्दी"
                                            {...register('darbandi', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.darbandi}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="pmis" label="कम्प्युटर कोड"
                                            {...register('pmis', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.pmis}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="sanket" label="संकेत नं."
                                            {...register('sanket', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.sanket}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="working_from" label="कार्यरत मिती"
                                            {...register('working_from', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.working_from}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="contact" label="सम्पर्क नं."
                                            {...register('contact', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.contact}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="blood_group" label="रक्त समूह"
                                            {...register('blood_group', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.blood_group}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="dob" label="जन्म मिति"
                                            {...register('dob', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.dob}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.gender}>
                                        <InputLabel id="gender">लिङ्ग</InputLabel>
                                        <Select
                                            labelId="gender-label"
                                            id="gender"
                                            defaultValue=""  // Set default value to empty string
                                            {...register('gender', { required: "This field is required." })}
                                            autoWidth
                                            label="लिङ्ग"
                                        >
                                            <MenuItem value="" disabled><em>लिङ्ग</em></MenuItem>
                                            <MenuItem value="M" key='M'>पुरुष</MenuItem>
                                            <MenuItem value="F" key='F'>महिला</MenuItem>
                                            <MenuItem value="O" key='O'>अन्य</MenuItem>
                                        </Select>
                                        {errors.gender && <p style={{ color: 'red' }}>{errors.gender.message}</p>} {/* Display validation error */}
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="bp" label="ब्लड प्रेसर"
                                            {...register('bp')}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.bp}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="height" label="उचाई(Height)"
                                            {...register('height')}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.height}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="weight" label="तौल(Weight)"
                                            {...register('weight')}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.weight}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.is_active}>
                                        <InputLabel id="is_active">हाल कार्यरत</InputLabel>
                                        <Select
                                            labelId="is_active-label"
                                            id="is_active"
                                            defaultValue=""  // Set default value to empty string
                                            {...register('is_active', { required: "This field is required." })}
                                            autoWidth
                                            label="हाल कार्यरत"
                                        >
                                            <MenuItem value="" disabled><em>हाल कार्यरत</em></MenuItem>
                                            <MenuItem value="1" key='M'>छ</MenuItem>
                                            <MenuItem value="0" key='F'>छैन</MenuItem>
                                        </Select>

                                    </FormControl>
                                </Grid>

                            </Grid>
                        </Box>


                        <div className="col-12">
                            <button type="submit" className="btn btn-primary" disabled={isLoading} onClick={handleSubmit(onFormSubmit)} >
                                {/* {loading ? 'Submitting...' : editing ? 'Update Employee' : 'Add Employee'} */}submit
                            </button>
                            <div className="col mb-3">
                                {/* <button className='btn btn-danger' onClick={handleClear}>Clear</button> */}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <PoliceRecordTable
                records={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {/* <button><Logout/></button> */}
        </React.Fragment>
    )
}

export default PoliceForm
