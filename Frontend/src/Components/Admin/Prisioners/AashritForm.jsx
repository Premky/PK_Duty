import { useTheme } from '@emotion/react'
import axios from 'axios'
import React, { useEffect, useState, useTransition } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import NepaliDate from 'nepali-datetime'
// import Select from 'react-select';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button,
    FormControl, Container, Select, InputLabel,
    MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
// import PoliceRecordTable from './PoliceRecordTable';
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'
import PrisionersRecordTable from './PrisionersRecordTable'

const AashritForm = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);

    const [adminOffice, setAdminOffice] = useState([]);

    const [selectedCase, setSelectedCase] = useState('');
    const [cases, setCases] = useState([]); //Holds the records added or fetched for editing;
    const [records, setRecords] = useState([]); //Holds the records added or fetched for editing;




    const currentofficeid = localStorage.getItem('main_office_id')
    const currentofficenp = localStorage.getItem('office_np')

    //Specifically for this form:
    const [office_id, setOffice_id] = useState("");
    const [prisioner_type, setPrisioner_type] = useState("आश्रित");
    const [case_id, setCase_id] = useState("");
    const [gender, setGender] = useState("");

    const fetchAdminOffices = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/common/get_admin_office`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setAdminOffice(Result); //Set the fetched Records
                } else {
                    // alert("No record Found");
                    console.log("No Country Found");
                }
            } else {
                alert(Error || 'Failed to fetch case data.');
                console.log('Failed to fetch case data.')
            }
        } catch (error) {
            console.error('Error fetching delete case:', error);
            alert('An error occurred while fetching case data. Please try again.');
        }
    };

    const onFormSubmit = async (data) => {
        // setLoading(true);
        startTransition(async () => {
            console.log(data)
            try {
                // const formData = new FormData();
                const url = editing ? `${BASE_URL}/prisioner/update_aashrit/${currentData.id}` : `${BASE_URL}/prisioner/add_aashrit`;
                const method = editing ? 'PUT' : 'POST';
                const result = await axios({
                    method, url, data,
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                })


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
            const response = await axios.get(`${BASE_URL}/prisioner/get_aashrit_prisioners`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setRecords(Result); //Set the fetched Records
                    // console.log(Result);
                } else {
                    console.log("No Record Found")
                }
            } else {
                // alert(Error || 'Failed to fetch records.');
                console.log(Error || 'Failed to fetch records.')
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            alert('An error occured while fetching records.');
        }
    };

    const handleEdit = (record) => {
        console.log(record)
        setCurrentData(record);
        setEditing(true);

        setOffice_id(record.office_id);
        setPrisioner_type(record.prisioner_type);
        setCase_id(record.case_id);
        setGender(record.gender);
        setFaisala_office(record.faisala_office);
        setPunrabedan(record.punarabedan);

        setValue('office', record.office_id);
        setValue('prisioner_type', record.prisioner_type);
        setValue('name_np', record.name_np);
        setValue('name_en', record.name_en);
        setValue('gender', record.gender);
        setValue('dob', record.dob);
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


    const [guardianOptions, setGuardianOptions] = useState([]);
    const fetchGuardians = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/prisioner/get_prisioners`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {

                    // console.log(Result);
                    const guardianOptions = Result.map((data) => ({
                        label: `${data.name_np || ''} ${'(' + data.case_np + ')' || ''}`, id: data.id
                    }))
                    setGuardianOptions(guardianOptions);
                } else {
                    console.log("No Record Found")
                }
            } else {
                // alert(Error || 'Failed to fetch records.');
                console.log(Error || 'Failed to fetch records.')
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            alert('An error occured while fetching records.');
        }
    };


    useEffect(() => {
        // handleLogin();
        fetchGuardians();
        fetchAdminOffices();
        fetchRecords();

    }, [])

    // console.log(currentofficenp, currentofficeid)
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
                                        <InputLabel id="office">कारागारको नाम</InputLabel>
                                        <Select
                                            labelId="office_id-label"
                                            id="office"
                                            {...register('office_id', { required: "This field is required." })}
                                            autoWidth
                                            label="मुद्दा"
                                            defaultValue={currentofficeid}
                                        >
                                            {adminOffice.map((data) => (
                                                <MenuItem value={data.id} key={data.id} disabled>{data.office_np}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }} error={!!errors.guardian}>
                                        <Controller
                                            name="guardian"
                                            control={control}
                                            rules={{ required: "This field is required." }}
                                            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                                                <Autocomplete
                                                    id="prisioner_name"
                                                    disablePortal
                                                    options={guardianOptions}
                                                    value={value || null} // Ensure controlled value
                                                    onChange={(_, data) => onChange(data)} // Update form state
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="कैदीको नामथर नाम"
                                                            error={!!error} // Highlight error if exists
                                                            helperText={error ? error.message : null} // Show error message
                                                            inputRef={ref} // Pass ref to the input
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>




                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }} error={!!errors.name_np}>
                                        <TextField
                                            id="name_np"
                                            label="नाबालकको नाम नेपालीमा"
                                            {...register('name_np', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_np}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }} >
                                        <TextField
                                            id="name_en"
                                            // value='-'
                                            label="नाबालकको नाम (अंग्रेजीमा)"
                                            {...register('name_en', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_en}
                                        />
                                        {/* {errors.name_en && <p style={{ color: 'red' }}>{errors.name_en.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.gender}>
                                        <InputLabel id="gender">लिङ्ग</InputLabel>
                                        <Select
                                            labelId="gender-label"
                                            id="gender"
                                            // defaultValue=""  // Set default value to empty string
                                            value={gender}
                                            {...register('gender', { required: "This field is required." })}
                                            onChange={(e) => setGender(e.target.value)}
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
                                    <FormControl sx={{
                                        "& input": {
                                            padding: "10px",
                                            fontSize: "16px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }
                                    }} error={!!errors.dob}>
                                        < div className="col-xl-3 col-md-4 col-sm-12">
                                            <label htmlFor="dob">जन्म मिति<span>*</span></label>
                                            <Controller
                                                name="dob"
                                                control={control}
                                                rules={{ required: "This field is required" }}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <NepaliDatePicker
                                                        value={value || ""} // Ensure empty string when no date is selected
                                                        onChange={(dob) => {
                                                            onChange(dob); // Update form state
                                                        }}
                                                        onBlur={onBlur} // Handle blur
                                                        dateFormat="YYYY-MM-DD" // Customize your date format
                                                        placeholder="Select Nepali Date"
                                                    // ref={ref} // Use ref from react-hook-form
                                                    />
                                                )}
                                            />
                                            {errors.dob && <span style={{ color: 'red' }}>{errors.dob.message}</span>}
                                        </div>
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
                    <div>

                    </div>
                </div>
            </div >

        </React.Fragment >
    )
}

export default AashritForm
