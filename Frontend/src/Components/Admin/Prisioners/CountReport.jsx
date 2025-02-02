import { useTheme } from '@emotion/react'
import axios from 'axios'
import React, { useEffect, useState, useTransition } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import NepaliDate from 'nepali-datetime'
const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fm = new NepaliDate().format('MM'); //Support for filter
const fy_date = fy + '-4-1'
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
// import { exportToExcel } from "./../Prisioners/MaskebariExport"; // Import function
import { exportToExcel } from './ExportToExcel'
import ExcelJS from 'exceljs';
import ReleasedPrisionersTable from './MaskebariTables/ReleasedPrisionersTable'
import CurrentCountTable from './MaskebariTables/CurrentCountTable'
import CountryWiseReport from './MaskebariTables/CountryWiseReport'
const CountPoliceReport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');


    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm({
        defaultValues: {
            startDate: formattedDateNp,
            endDate: formattedDateNp
        },
    });

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);
    const [records, setRecords] = useState([]);
    const [foreignrecords, setForeignRecords] = useState([]);
    const [totals, setTotals] = useState({
        KaidiMale: 0,
        KaidiFemale: 0,
        ThunuwaMale: 0,
        ThunuwaFemale: 0,
        TotalAashrit: 0,
        Total: 0,
    });
    const [foreignTotals, setForeignTotals] = useState({});
    const [start_Date, setStart_Date] = useState(formattedDateNp);
    const [end_Date, setEnd_Date] = useState(formattedDateNp);
    const [releasedCounts, setReleasedCounts] = useState([]);

    const fetchRecords = async (data) => {
        // if (!data) { data = nul`l }
        // console.log(data)
        try {
            const url = `${BASE_URL}/prisioner/get_nepali_prisioners_report`;

            const queryParams = new URLSearchParams({
                startDate: data?.startDate || formattedDateNp,
                endDate: data?.endDate || formattedDateNp,
            }).toString();
            console.log(queryParams)
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

    const fetchForeignRecords = async (data) => {
        try {
            const url = `${BASE_URL}/prisioner/get_foreign_prisioners_report`;
            const queryParams = new URLSearchParams({
                startDate: data?.startDate || formattedDateNp,
                endDate: data?.endDate || formattedDateNp,
            }).toString();
            console.log(queryParams)
            const fullUrl = `${url}?${queryParams}`;

            const response = await axios.get(fullUrl, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // If cookies are required
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setForeignRecords(Result); //Set the fetched Records
                    // console.log(Result);
                    calculateForeignTotals(Result);
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

    const fetchReleasedCounts = async (data) => {
        try {
            const url = `${BASE_URL}/prisioner/get_released_counts`;
            const queryParams = new URLSearchParams({
                endDate: data?.endDate || formattedDateNp,
            }).toString();
            const fullUrl = `${url}?${queryParams}`;

            const response = await axios.get(fullUrl, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // If cookies are required
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setReleasedCounts(Result[0]);
                    console.log("Fetched data:", Result[0]);
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
                KaidiAgeAbove65: acc.KaidiAgeAbove65 + (parseInt(record.KaidiAgeAbove65) || 0),
                ThunuwaAgeAbove65: acc.ThunuwaAgeAbove65 + (parseInt(record.ThunuwaAgeAbove65) || 0),
                KaidiNabalak: acc.KaidiNabalak + (parseInt(record.KaidiNabalak) || 0),
                ThunuwaNabalak: acc.ThunuwaNabalak + (parseInt(record.ThunuwaNabalak) || 0),
                TotalNabalkrNabalik: acc.TotalNabalkrNabalik + (parseInt(record.KaidiNabalak) + parseInt(record.ThunuwaNabalak)),
                Maashrit: acc.Maashrit + (parseInt(record.Maashrit) || 0),
                Faashrit: acc.Faashrit + (parseInt(record.Faashrit) || 0),
                TotalAashrit: acc.TotalAashrit + (parseInt(record.Maashrit) + parseInt(record.Faashrit)),
                TotalMaleReleasedInDateRange: acc.TotalMaleReleasedInDateRange + (parseInt(record.TotalMaleReleasedInDateRange) || 0),
                TotalFemaleReleasedInDateRange: acc.TotalFemaleReleasedInDateRange + (parseInt(record.TotalFemaleReleasedInDateRange) || 0),
                TotalMaleArrestedInDateRange: acc.TotalMaleArrestedInDateRange + (parseInt(record.TotalMaleArrestedInDateRange) || 0),
                TotalFemaleArrestedInDateRange: acc.TotalFemaleArrestedInDateRange + (parseInt(record.TotalFemaleArrestedInDateRange) || 0),
                Total: acc.Total + (parseInt(record.Total) || 0),
            }),
            {
                KaidiTotal: 0, ThunuwaTotal: 0, KaidiMale: 0, KaidiFemale: 0, ThunuwaMale: 0, ThunuwaFemale: 0,
                SumOfArrestedInDateRange: 0, SumOfReleasedInDateRange: 0,
                KaidiAgeAbove65: 0, ThunuwaAgeAbove65: 0,
                TotalMaleArrestedInDateRange: 0, TotalFemaleArrestedInDateRange: 0, TotalMaleReleasedInDateRange: 0, TotalFemaleReleasedInDateRange: 0,
                KaidiNabalak: 0, ThunuwaNabalak: 0, Maashrit: 0, Faashrit: 0, TotalAashrit: 0, Total: 0
            }
        );
        setTotals(totals);
    };
    const calculateForeignTotals = (data) => {
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
                KaidiAgeAbove65: acc.KaidiAgeAbove65 + (parseInt(record.KaidiAgeAbove65) || 0),
                ThunuwaAgeAbove65: acc.ThunuwaAgeAbove65 + (parseInt(record.ThunuwaAgeAbove65) || 0),
                KaidiNabalak: acc.KaidiNabalak + (parseInt(record.KaidiNabalak) || 0),
                ThunuwaNabalak: acc.ThunuwaNabalak + (parseInt(record.ThunuwaNabalak) || 0),
                TotalNabalkrNabalik: acc.TotalNabalkrNabalik + (parseInt(record.KaidiNabalak) + parseInt(record.ThunuwaNabalak)),
                Maashrit: acc.Maashrit + (parseInt(record.Maashrit) || 0),
                Faashrit: acc.Faashrit + (parseInt(record.Faashrit) || 0),
                TotalAashrit: acc.TotalAashrit + (parseInt(record.Maashrit) + parseInt(record.Faashrit)),
                TotalMaleReleasedInDateRange: acc.TotalMaleReleasedInDateRange + (parseInt(record.TotalMaleReleasedInDateRange) || 0),
                TotalFemaleReleasedInDateRange: acc.TotalFemaleReleasedInDateRange + (parseInt(record.TotalFemaleReleasedInDateRange) || 0),
                TotalMaleArrestedInDateRange: acc.TotalMaleArrestedInDateRange + (parseInt(record.TotalMaleArrestedInDateRange) || 0),
                TotalFemaleArrestedInDateRange: acc.TotalFemaleArrestedInDateRange + (parseInt(record.TotalFemaleArrestedInDateRange) || 0),
                Total: acc.Total + (parseInt(record.Total) || 0),
            }),
            {
                KaidiTotal: 0, ThunuwaTotal: 0, KaidiMale: 0, KaidiFemale: 0, ThunuwaMale: 0, ThunuwaFemale: 0,
                SumOfArrestedInDateRange: 0, SumOfReleasedInDateRange: 0,
                KaidiAgeAbove65: 0, ThunuwaAgeAbove65: 0,
                TotalMaleArrestedInDateRange: 0, TotalFemaleArrestedInDateRange: 0, TotalMaleReleasedInDateRange: 0, TotalFemaleReleasedInDateRange: 0,
                KaidiNabalak: 0, ThunuwaNabalak: 0, Maashrit: 0, Faashrit: 0, TotalAashrit: 0, Total: 0
            }
        );
        setForeignTotals(totals);
    };

    const exportMaskebari = async () => {
        await exportToExcel(releasedCounts, records, totals, foreignrecords, foreignTotals, fy, fm);
    };


    useEffect(() => {
        fetchRecords(); //For Nepali Prisioners
        fetchForeignRecords();
        fetchPoliceCommander();
        fetchReleasedCounts();
    }, [])

    return (
        <>
            {/* <Link to='/police'>Police Form</Link> */}
            <div className="report_title text-center bg-info bg-gradient p-2">
                कारागार कार्यालयको मास्केवारी विवरण
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

                <button onClick={exportMaskebari}>Download मास्केबारी</button>
            </div>
            <div className="report_data">
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <ReleasedPrisionersTable releasedCounts={releasedCounts} />

                    <CurrentCountTable releasedCounts={releasedCounts} totals={totals} fy={fy} fm={fm}/>
                    
                    <CountryWiseReport records={records} totals={totals}/>
                    
                    <CountryWiseReport records={foreignrecords} totals={foreignTotals}/>
                    
                </TableContainer>
            </div>
        </>
    )
}

export default CountPoliceReport
