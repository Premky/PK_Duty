import { useTheme } from '@emotion/react'
import axios from 'axios'
import React, { useEffect, useState, useTransition } from 'react'
import {Link, useNavigate, useParams } from 'react-router-dom'
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
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'

const CountPoliceReport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const datebefore7days = new NepaliDate(npToday)
    datebefore7days.setDate(npToday.getDate() - 7);
    const formatteddatebefore7days = datebefore7days.format('YYYY-MM-DD');

    // console.log(formattedDateNp, formatteddatebefore7days)

    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm({
        defaultValues: {
            startDate: formatteddatebefore7days,
            endDate: formattedDateNp
    },
    });

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);
    const [records, setRecords] = useState([]);
    const [totals, setTotals] = useState({
        KaidiMale: 0,
        KaidiFemale: 0,
        ThunuwaMale: 0,
        ThunuwaFemale: 0,
        Total: 0,
    });

    const fetchRecords = async (data) => {
        // if (!data) { data = nul`l }
        console.log(data)
        try {
            const url = `${BASE_URL}/common/get_prisioners_report`;

            const queryParams = new URLSearchParams({
                startDate: data?.startDate||formatteddatebefore7days,
                endDate:data?.endDate || formattedDateNp,
            }).toString();

            const fullUrl = `${url}?${queryParams}`;

            const response = await axios.get(fullUrl,{
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // If cookies are required
            });            

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setRecords(Result); //Set the fetched Records
                    console.log(Result);
                    calculateTotals(Result);
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
    

    const calculateTotals = (data) => {
        console.log(data)
        const totals = data.reduce(
            (acc, record) => ({
                KaidiTotal: parseInt(acc.KaidiTotal) + parseInt(record.KaidiTotal),
                ThunuwaTotal: parseInt(acc.ThunuwaTotal) + parseInt(record.ThunuwaTotal),
                KaidiMale: parseInt(acc.KaidiMale) + parseInt(record.KaidiMale),
                KaidiFemale: parseInt(acc.KaidiFemale) + parseInt(record.KaidiFemale),
                ThunuwaMale: parseInt(acc.ThunuwaMale) + parseInt(record.ThunuwaMale),
                ThunuwaFemale: parseInt(acc.ThunuwaFemale) + parseInt(record.ThunuwaFemale),
                KaidiAgeAbove65: parseInt(acc.KaidiAgeAbove65) + parseInt(record.KaidiAgeAbove65),
                ThunuwaAgeAbove65: parseInt(acc.ThunuwaAgeAbove65) + parseInt(record.ThunuwaAgeAbove65),
                Nabalak: parseInt(acc.Nabalak) + parseInt(record.Nabalak),
                Nabalika: parseInt(acc.Nabalika) + parseInt(record.Nabalak),
                Total: parseInt(acc.Total) + parseInt(record.Total),
            }),
            {
                KaidiTotal: 0, ThunuwaTotal: 0, KaidiMale: 0, KaidiFemale: 0, ThunuwaMale: 0, ThunuwaFemale: 0,
                KaidiAgeAbove65: 0, ThunuwaAgeAbove65: 0, Nabalak: 0, Nabalika: 0, Total: 0
            }
        );
        setTotals(totals);
    };

    useEffect(() => {
        fetchRecords();
    }, [])

    return (
        <>
        <Link to = '/police'>Police Form</Link>
            <div className="report_title text-center bg-info bg-gradient p-2">
                संख्यात्मक विवरण
            </div>
            <div className="div pt-1">
                <form className="row">
                    <label htmlFor="startDate" className="col-xl-1 col-md-1 col-sm-12">देखी<span>*</span></label>
                    <div className="col-xl-2 col-md-3 col-sm-12">
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ required: "This field is required" }}
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <NepaliDatePicker
                                    value={value || startDate}
                                    onChange={(startDate) => {
                                        onChange(startDate);                                        
                                    }}
                                    onBlur={onBlur}
                                    dateFormat="YYYY-MM-DD"
                                    placeholder="नेपाली मिति चयन गर्नुहोस्"
                                    ref={ref}
                                />
                            )}
                        />
                        {errors.startDate && <span style={{ color: 'red' }}>{errors.startDate.message}</span>}
                    </div>

                    <label htmlFor="endDate" className="col-xl-1 col-md-1 col-sm-12">सम्म<span>*</span></label>
                    <div className="col-xl-2 col-md-3 col-sm-12">
                        <Controller
                            name="endDate"
                            control={control}
                            rules={{ required: "This field is required" }}
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <NepaliDatePicker
                                    value={value || endDate}
                                    onChange={(endDate) => {
                                        onChange(endDate);                                        
                                    }}
                                    onBlur={onBlur}
                                    dateFormat="YYYY-MM-DD"
                                    placeholder="नेपाली मिति चयन गर्नुहोस्"
                                    ref={ref}
                                />
                            )}
                        />
                        {errors.endDate && <span style={{ color: 'red' }}>{errors.endDate.message}</span>}
                    </div>

                    <div className="col-xl-2 col-md-3 col-sm-12">
                        <button type="submit" className="btn btn-primary" disabled={isLoading} onClick={handleSubmit(fetchRecords)}>
                            {isLoading ? <span className="spinner-border spinner-border-sm"></span> : "Search"}
                        </button>
                    </div>
                </form>

            </div>
            <div className="report_data">
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow className='bg-primary'>
                                <TableCell align="center" rowSpan={2}>सि.नं.</TableCell>
                                <TableCell align="center" rowSpan={2}>मुद्दा</TableCell>
                                <TableCell align="center" colSpan={3}>जम्मा</TableCell>
                                <TableCell align="center" colSpan={3}>कैदी</TableCell>
                                <TableCell align="center" colSpan={3}>थुनुवा</TableCell>
                                <TableCell align="center" rowSpan={2}>आएको संख्या</TableCell>
                                <TableCell align="center" rowSpan={2}>छुटेको संख्या</TableCell>
                                <TableCell align="center" rowSpan={2}>कैफियत</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
                                <TableCell align="center" className='bg-secondary fw-bold'>जम्मा</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>पुरुष</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>महिला</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient fw-bold'>जम्मा</TableCell>
                                <TableCell align="center" className='bg-secondary'>पुरुष</TableCell>
                                <TableCell align="center" className='bg-secondary'>महिला</TableCell>
                                <TableCell align="center" className='bg-secondary fw-bold'>जम्मा</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {records.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell align='center'>{index + 1}</TableCell>
                                    <TableCell>{record.CaseNameNP}</TableCell>
                                    <TableCell align='center'>{record.KaidiTotal}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaTotal}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.ThunuwaTotal) + parseInt(record.KaidiTotal)}</TableCell>
                                    <TableCell align='center'>{record.KaidiMale}</TableCell>
                                    <TableCell align='center'>{record.KaidiFemale}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.KaidiMale) + parseInt(record.KaidiFemale)}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaMale}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaFemale}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.ThunuwaMale) + parseInt(record.ThunuwaFemale)}</TableCell>

                                    <TableCell align='center'>{record.TotalArrestedInDateRange}</TableCell>
                                    <TableCell align='center'>{record.TotalReleasedInDateRange}</TableCell>
                                    

                                </TableRow>
                            ))}
                            <TableRow key='total' >
                                <TableCell className='bg-primary fw-bold' colSpan={2}>जम्मा</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.KaidiTotal) + parseInt(totals.ThunuwaTotal)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiFemale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.KaidiMale) + parseInt(totals.KaidiFemale)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaFemale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.ThunuwaMale) + parseInt(totals.ThunuwaFemale)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiAgeAbove65}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaAgeAbove65}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default CountPoliceReport
