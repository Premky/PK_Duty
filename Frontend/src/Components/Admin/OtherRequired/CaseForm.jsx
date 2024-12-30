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

// import PoliceRecordTable from './PoliceRecordTable';
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'

const CaseForm = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);


    const [records, setRecords] = useState([]); //Holds the records added or fetched for editing;

    const onFormSubmit = async (data) => {
        // setLoading(true);
        startTransition(async () => {
            // console.log(data)
            try {
                // const formData = new FormData();
                const url = editing ? `${BASE_URL}/common/update_case/${currentData.id}` : `${BASE_URL}/common/add_case`;
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
            const response = await axios.get(`${BASE_URL}/common/get_cases`);
            const { Status, Result, Error } = response.data;
            if (Status) {                
                if (Result?.length > 0) {
                    setRecords(Result); //Set the fetched Records
                } else {
                    alert("No record Found");
                }
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
            const result = await axios.delete(`${BASE_URL}/common/delete_case/${id}`);
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
        // fetchCase();
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
                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }}>
                                        <TextField
                                            id="name_np"
                                            label="मुद्दा नेपालीमा"
                                            {...register('name_np', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_np}
                                        />
                                        {/* {errors.name_np && <p style={{ color: 'red' }}>{errors.name_np.message}</p>} Display validation error */}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 215 }}>
                                        <TextField
                                            id="name_en"
                                            label="Case (IN ENGLISH)"
                                            {...register('name_en', { required: "This field is required." })}
                                            fullWidth
                                            margin="normal"
                                            error={!!errors.name_en}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={4} md={3} mt={3}>
                                    <FormControl sx={{ m: 0.5, minWidth: 50 }}>
                                        <Button disabled={isLoading} onClick={handleSubmit(onFormSubmit)} variant="outlined" color="primary">
                                            Save
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </div>
            </div>
            <div>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>सि.नं.</TableCell>
                                        <TableCell>मुद्दा नेपालीमा</TableCell>
                                        <TableCell>Case (अंग्रेजीमा)</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {records.map((record, index) => (
                                        <TableRow key={index}>                                            
                                            <TableCell>{index+1}</TableCell>
                                            <TableCell>{record.name_np}</TableCell>
                                            <TableCell>{record.name_en}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEdit(record)} variant="outlined" color="primary">
                                                    Edit
                                                </Button>
                                                <Button onClick={() => handleDelete(record.id)} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
            </div>
            {/* <PoliceRecordTable
                records={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
            /> */}
            {/* <button><Logout/></button> */}
        </React.Fragment>
    )
}

export default CaseForm
