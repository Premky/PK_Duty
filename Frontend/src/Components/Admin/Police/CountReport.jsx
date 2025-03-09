import { useTheme } from '@emotion/react'
import axios from 'axios'
import React, { useEffect, useState, useTransition, Suspense } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import NepaliDate from 'nepali-datetime'
const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fm = new NepaliDate().format('MM'); //Support for filter
const fy_date = fy + '-4-1'

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
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { exportToExcel } from './ExportPoliceWeekly'
// Lazy load the TableBodyComponent
const LazyCountTableBody = React.lazy(() => import('./CountTableBody'));

const CountPoliceReport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

    let formatteddatebefore7days = formattedDateNp;
    const [dateData, setDateData] = useState(null);
    const [start_Date, setStart_Date] = useState(formatteddatebefore7days);
    const [end_Date, setEnd_Date] = useState(formattedDateNp);
    try {
        const datebefore7days = new NepaliDate(npToday);
        console.log(datebefore7days)
        // const currentNepaliDate = { year: dateData.year, month: dateData.month, day: dateData.day };
        // const currentEnglishDate = { year: dateData.yearEn, month: dateData.monthEn + 1, day: dateData.dayEn }; // Adjust monthEn to 1-based

        // Calculate 7 days before
        // const nepaliDateBefore7Days = calculateNepaliDate(currentNepaliDate.year, currentNepaliDate.month, currentNepaliDate.day, 7);
        // const englishDateBefore7Days = calculateEnglishDate(currentEnglishDate.year, currentEnglishDate.month - 1, currentEnglishDate.day, 7); // Convert month to 0-based for Date object   

    } catch (error) {
        console.error("Error calculating date before 7 days:", error);
        formatteddatebefore7days = formattedDateNp; // Handle the case where the date is invalid
    }

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
        TotalAashrit: 0,
        Total: 0,
    });


    const fetchRecords = async (data) => {
        // if (!data) { data = nul`l }
        // console.log(data)
        try {
            const url = `${BASE_URL}/common/get_prisioners_report`;

            const queryParams = new URLSearchParams({
                startDate: data?.startDate || formatteddatebefore7days,
                endDate: data?.endDate || formattedDateNp,
            }).toString();
            // alert(queryParams)
            const fullUrl = `${url}?${queryParams}`;

            const response = await axios.get(fullUrl, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // If cookies are required
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setRecords(Result); //Set the fetched Records
                    // console.log(Result);
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
    const [policeCommander, setPoliceCommander] = useState([]);
    const fetchPoliceCommander = async (data) => {
        try {
            const url = `${BASE_URL}/police/police_commander`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // If cookies are required
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setPoliceCommander(Result);
                    // console.log("Fetched data:", policeCommander);
                } else {
                    console.log("No Record Found");
                }
            } else {
                console.log(Error || "Failed to fetch records.");
            }
        } catch (error) {
            console.error("Error fetching records:", error);
            alert("An error occurred while fetching records.");
        }
    };


    const calculateTotals = (data) => {
        const totals = data.reduce(
            (acc, record) => ({
                KaidiTotal: acc.KaidiTotal + (parseInt(record.KaidiTotal) || 0),
                ThunuwaTotal: acc.ThunuwaTotal + (parseInt(record.ThunuwaTotal) || 0),
                KaidiMale: acc.KaidiMale + (parseInt(record.KaidiMale) || 0),
                KaidiFemale: acc.KaidiFemale + (parseInt(record.KaidiFemale) || 0),
                ThunuwaMale: acc.ThunuwaMale + (parseInt(record.ThunuwaMale) || 0),
                ThunuwaFemale: acc.ThunuwaFemale + (parseInt(record.ThunuwaFemale) || 0),
                SumOfArrestedInDateRange: acc.SumOfArrestedInDateRange + (parseInt(record.TotalArrestedInDateRange) || 0),
                SumOfReleasedInDateRange: acc.SumOfReleasedInDateRange + (parseInt(record.TotalReleasedInDateRange) || 0),
                ThunuwaAgeAbove65: acc.ThunuwaAgeAbove65 + (parseInt(record.ThunuwaAgeAbove65) || 0),
                Nabalak: acc.Nabalak + (parseInt(record.Nabalak) || 0),
                Nabalika: acc.Nabalika + (parseInt(record.Nabalika) || 0),
                Total: acc.Total + (parseInt(record.Total) || 0),
            }),
            {
                KaidiTotal: 0, ThunuwaTotal: 0, KaidiMale: 0, KaidiFemale: 0, ThunuwaMale: 0, ThunuwaFemale: 0,
                SumOfArrestedInDateRange: 0, SumOfReleasedInDateRange: 0, ThunuwaAgeAbove65: 0, Nabalak: 0, Nabalika: 0, Total: 0
            }
        );
        setTotals(totals);
    };

    const ExportPoliceWeekly = async () => {
        await exportToExcel(start_Date, end_Date, records, totals, fy, fm, formattedDateNp, policeCommander);
    };
    useEffect(() => {
        fetchDateData(); // Your function to get data
    }, []);

    function fetchDateData() {
        setTimeout(() => {
            setDateData(new Date()); // Example
        }, 1000);
    }

    useEffect(() => {
        fetchRecords();
        fetchPoliceCommander();
    }, [])

    return (
        <>
            {/* <Link to='/police'>Police Form</Link> */}
            <div className="report_title text-center bg-info bg-gradient p-2">
                संख्यात्मक विवरण {formatteddatebefore7days} देखि {formattedDateNp}
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
                                        setStart_Date(startDate);
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
                                        setEnd_Date(endDate);
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
                <button onClick={ExportPoliceWeekly} className='btn btn-sm btn-success'>Download</button>
            </div>
            <div className="report_data">
                {/* Suspense to show a fallback while the body is loading */}
                <Suspense fallback={<div>Loading...</div>}>
                    {!isLoading && <LazyCountTableBody records={records} totals={totals}
                        // startDate={queryParams.startDate}
                        // endDate={queryParams.endDate}
                    />}
                </Suspense>
            </div>
        </>
    )
}

export default CountPoliceReport
