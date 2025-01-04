import { useTheme } from '@emotion/react'
import axios from 'axios'
import React, { useEffect, useState, useTransition } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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

// import PoliceRecordTable from './PoliceRecordTable';
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'
import PrisionersRecordTable from './PrisionersRecordTable'

const PrisionersForm = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);

    const [countries, setCountries] = useState([]);
    const [juidicialbody, setJuidicialbody] = useState([]);
    const [adminOffice, setAdminOffice] = useState([]);

    const [selectedCase, setSelectedCase] = useState('');
    const [cases, setCases] = useState([]); //Holds the records added or fetched for editing;
    const [records, setRecords] = useState([]); //Holds the records added or fetched for editing;

    const currentofficeid = localStorage.getItem('office_id')
    const currentofficenp = localStorage.getItem('office_np')

    //Specifically for this form:
    const [office_id, setOffice_id] = useState("");
    const [prisioner_type, setPrisioner_type] = useState("");
    const [case_id, setCase_id] = useState("");
    const [gender, setGender] = useState("");
    const [faisala_office, setFaisala_office] = useState(0);
    const [punarabedan, setPunrabedan] = useState(0);

    const [arrestedDate, setArrestedDate] = useState("");
    const [karagarDate, setKaragarDate] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [duration, setDuration] = useState(0);
    const [fine, setFine] = useState(0);
    const [fineDuration, setFineDuration] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const calculate_duration = (s, e) => {
        if (s && e) {
            const start = new Date(s);
            const end = new Date(e);

            if (start < end) {
                const diffInTime = end - start;
                const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
                setDuration(diffInDays);
            } else {
                console.log("Invalid Dates", "Arrested Date:", start, "Release Date:", end);
            }
        }
    };


    const calculate_fine_duration = async (fine) => {
        const fine_duration = fine / 300;
        setFineDuration(fine_duration);
        const total_duration = duration + fine_duration;
        setTotalDuration(total_duration);
    }

    const calculate_total_duration = async () => {
        const total_duration = parseInt(duration) + parseInt(fineDuration);
        setTotalDuration(total_duration);
    }

    const fetchCase = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/common/get_cases`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setCases(Result); //Set the fetched Records
                } else {
                    alert("No record Found");
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

    const fetchCountry = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/common/get_countries`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setCountries(Result); //Set the fetched Records
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

    const fetchJuidicialbody = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/common/get_juidicialbody`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setJuidicialbody(Result); //Set the fetched Records
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
                const url = editing ? `${BASE_URL}/prisioner/update_prisioner/${currentData.id}` : `${BASE_URL}/prisioner/add_prisioner`;
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
            const response = await axios.get(`${BASE_URL}/prisioner/get_prisioners`);
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setRecords(Result); //Set the fetched Records
                    console.log(Result);
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
        setValue('case_id', record.case_id);
        setValue('jaherwala', record.jaherwala);
        setValue('name_np', record.name_np);
        setValue('name_en', record.name_en);
        setValue('country', record.country);
        setValue('address', record.address);
        setValue('gender', record.gender);
        setValue('dob', record.dob);
        setValue('karagar_date,', record.karagar_date,);
        setValue('arrested', record.arrested);
        setValue('release_date', record.release_date);
        setValue('faisala_office', record.faisala_office);
        setValue('faisala_date', record.faisala_date);
        setValue('punarabedan', record.punarabedan);        
        setValue('duration', record.duration);
        setValue('fine', record.fine);
        setValue('fine_duration', record.fine_duration);
        setValue('total_duration', record.total_duration);        
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
        fetchCase();
        fetchRecords();
        fetchCountry();
        fetchJuidicialbody();
        fetchAdminOffices();
    }, [])

    // console.log(currentofficenp, currentofficeid)
    // const actionRank = useActionState(fetchRank);
    return (
        <React.Fragment>
            <div className="col-12">
                <div className="d-flex flex-column px-3 pt-0">
                    <button> <Link to='/prisioner/report'>Report</Link></button>
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
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.prisioner_type}>
                                        <InputLabel id="prisioner_type">कैदीको प्रकार</InputLabel>
                                        <Select
                                            labelId="type-label"
                                            id="prisioner_type"
                                            // defaultValue={prisioner_type}  // Set default value to empty string
                                            value={prisioner_type}
                                            {...register('prisioner_type', { required: "This field is required." })}
                                            onChange={(e) => setPrisioner_type(e.target.value)}
                                            autoWidth
                                            label="कैदीको प्रकार"
                                        >
                                            <MenuItem value="" disabled><em>कैदीको प्रकार</em></MenuItem>
                                            <MenuItem value="थुनुवा" key='t0'>थुनुवा</MenuItem>
                                            <MenuItem value="कैदी" key='t1'>कैदी</MenuItem>
                                        </Select>
                                        {errors.prisioner_type && <p style={{ color: 'red' }}>{errors.prisioner_type.message}</p>} {/* Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.rank}>
                                        <InputLabel id="case_id">मुद्दा</InputLabel>
                                        <Select
                                            labelId="rank-label"
                                            id="case_id"
                                            value={case_id}
                                            {...register('case_id', { required: "This field is required." })}
                                            onChange={(e) => setCase_id(e.target.value)}
                                            autoWidth
                                            label="मुद्दा"
                                        >
                                            <MenuItem value=""><em>मुद्दा</em></MenuItem>
                                            {cases.map((data) => (
                                                <MenuItem value={data.id} key={data.id}>{data.name_np}</MenuItem>
                                            ))}
                                        </Select>
                                        {/* {errors.rank && <p style={{ color: 'red' }}>{errors.rank.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="jaherwala" label="जाहेरवाला"
                                            {...register('jaherwala', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.jaherwala}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }} error={!!errors.name_np}>
                                        <TextField
                                            id="name_np"
                                            label="प्रतिवादीको नाम नेपालीमा"
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
                                            label="प्रतिवादीको नाम (अंग्रेजीमा)"
                                            {...register('name_en', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_en}
                                        />
                                        {/* {errors.name_en && <p style={{ color: 'red' }}>{errors.name_en.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.country}>
                                        <InputLabel id="country">देश</InputLabel>
                                        <Select
                                            labelId="country-label"
                                            id="country"
                                            {...register('country', { required: "This field is required." })}
                                            autoWidth
                                            label="देश"
                                            defaultValue="154"
                                        >
                                            <MenuItem value=""><em>देश</em></MenuItem>
                                            {countries.map((data) => (
                                                <MenuItem value={data.id} key={data.id} >
                                                    {data.name_np}</MenuItem>
                                            ))}
                                        </Select>
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

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ "& input": { padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" } }} error={!!errors.arrested}>
                                        <div className="col-xl-3 col-md-4 col-sm-12">
                                            <label htmlFor="karagar_date">कारागार परेको मिति<span>*</span></label>
                                            <Controller
                                                name="karagar_date"
                                                control={control}
                                                rules={{ required: "This field is required" }}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <NepaliDatePicker
                                                        value={value || ""} // Ensure empty string when no date is selected
                                                        onChange={(karagar_date) => {
                                                            onChange(karagar_date); // Update form state
                                                            setKaragarDate(karagar_date); // Update state
                                                            
                                                        }}
                                                        onBlur={onBlur} // Handle blur
                                                        dateFormat="YYYY-MM-DD" // Customize your date format
                                                        placeholder="Select Nepali Date"
                                                        ref={ref} // Use ref from react-hook-form
                                                    />
                                                )}
                                            />
                                            {errors.karagar_date && <span style={{ color: 'red' }}>{errors.karagar_date.message}</span>}
                                        </div>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ "& input": { padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" } }} error={!!errors.arrested}>
                                        <div className="col-xl-3 col-md-4 col-sm-12">
                                            <label htmlFor="arrested">थुना परेको मिति<span>*</span></label>
                                            <Controller
                                                name="arrested"
                                                control={control}
                                                //rules={{ required: "This field is required" }}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <NepaliDatePicker
                                                        value={value || ""} // Ensure empty string when no date is selected
                                                        onChange={(arrested) => {
                                                            onChange(arrested); // Update form state
                                                            setArrestedDate(arrested); // Update state
                                                            calculate_duration(arrested, '1999-01-01'); // Trigger duration calculation
                                                        }}
                                                        onBlur={onBlur} // Handle blur
                                                        dateFormat="YYYY-MM-DD" // Customize your date format
                                                        placeholder="Select Nepali Date"
                                                        ref={ref} // Use ref from react-hook-form
                                                    />
                                                )}
                                            />
                                            {errors.arrested && <span style={{ color: 'red' }}>{errors.arrested.message}</span>}
                                        </div>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ "& input": { padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" } }} error={!!errors.release_date}>
                                        <div className="col-xl-3 col-md-4 col-sm-12">
                                            <label htmlFor="release_date">कैद मुक्त हुने मिति<span>*</span></label>
                                            <Controller
                                                name="release_date"
                                                control={control}
                                                // rules={{ required: "This field is required" }}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <NepaliDatePicker
                                                        value={value || ""} // Ensure empty string when no date is selected
                                                        onChange={(release_date) => {
                                                            onChange(release_date); // Update form state
                                                            setReleaseDate(release_date); // Update state
                                                            calculate_duration(arrestedDate, release_date); // Trigger duration calculation
                                                        }}
                                                        onBlur={onBlur} // Handle blur
                                                        dateFormat="YYYY-MM-DD" // Customize your date format
                                                        placeholder="Select Nepali Date"
                                                        ref={ref} // Use ref from react-hook-form
                                                    />
                                                )}
                                            />
                                            {errors.release_date && <span style={{ color: 'red' }}>{errors.release_date.message}</span>}
                                        </div>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.faisala_office}>
                                        <InputLabel id="faisala_office">फैसला सुनाउने निकाय</InputLabel>
                                        <Select
                                            labelId="faisala_office-label"
                                            id="faisala_office"
                                            value={faisala_office}
                                            {...register('faisala_office')}
                                            onChange={(e) => setFaisala_office(e.target.value)}
                                            autoWidth
                                            label="फैसला सुनाउने निकाय"
                                            defaultValue='0'
                                        >
                                            <MenuItem value='0'><em>फैसला सुनाउने निकाय</em></MenuItem>
                                            {juidicialbody.map((data) => (
                                                <MenuItem value={data.id} key={data.id}>{data.name_np}</MenuItem>
                                            ))}
                                        </Select>
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
                                    }} error={!!errors.faisala_date}>

                                        <label htmlFor="faisala_date">फैसला मिति</label>
                                        <NepaliDatePicker
                                            inputClassName="form-control"
                                            // value={date}
                                            {...register('faisala_date')}
                                            options={{ calenderLocale: "ne", valueLocale: "en" }}
                                        />
                                        {errors.faisala_date && <p style={{ color: 'red' }}>{errors.faisala_date.message}</p>} {/* Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} mt={2}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} error={!!errors.punarabedan}>
                                        <InputLabel id="punarabedan">पुनरावेदन</InputLabel>
                                        <Select
                                            labelId="punarabedan-label"
                                            id="punarabedan"
                                            defaultValue="0"  // Set default value to empty string
                                            value={punarabedan}
                                            {...register('punarabedan')}
                                            onChange={(e) => setPunrabedan(e.target.value)}
                                            autoWidth
                                            label="पुनरावेदन"
                                        >
                                            <MenuItem value="0"><em>पुनरावेदन</em></MenuItem>
                                            <MenuItem value="1" key='Y'>परेको</MenuItem>
                                            <MenuItem value="0" key='N'>नपरेको</MenuItem>
                                        </Select>
                                        {errors.punarabedan && <p style={{ color: 'red' }}>{errors.punarabedan.message}</p>} {/* Display validation error */}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }} >
                                        <TextField id="duration" label="कैद अवधी"
                                            {...register('duration')}
                                            fullWidth
                                            margin="normal"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="fine" label="जरिवाना रकम"
                                            {...register('fine')}
                                            fullWidth
                                            margin="normal"
                                            value={fine}
                                            onChange={(e) => {
                                                setFine(e.target.value)
                                                calculate_fine_duration(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="fine_duration" label="जरिवाना वापतको कैद"
                                            {...register('fine_duration')}
                                            fullWidth
                                            margin="normal"
                                            value={fineDuration}
                                            onChange={(e) => setFineDuration(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} xl={3}>
                                    <FormControl sx={{ m: .5, minWidth: 215 }}>
                                        <TextField id="total_duration" label="कुल कैद अवधि"
                                            {...register('total_duration')}
                                            fullWidth
                                            margin="normal"
                                            value={totalDuration}
                                            onChange={(e) => {
                                                setTotalDuration(e.target.value)
                                                calculate_total_duration
                                            }}
                                            onClick={calculate_total_duration}
                                        />
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
            </div >
            <PrisionersRecordTable
                records={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </React.Fragment >
    )
}

export default PrisionersForm
