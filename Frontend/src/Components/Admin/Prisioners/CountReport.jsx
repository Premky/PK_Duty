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
        try{
            const url=`${BASE_URL}/prisioner/get_foreign_prisioners_report`;
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
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="" colSpan={8}>चालु आर्थिक वर्षमा छुटेका कैदीबन्दीको संख्याः</TableCell>
                            </TableRow>
                            <TableRow className='bg-primary bg-gradient'>
                                <TableCell align="center" colSpan={2}>अदालतको आदेश वा नियमित छुट संख्या</TableCell>
                                <TableCell align="center" colSpan={2}>कामदारी सुविधा पाएका संख्या</TableCell>
                                <TableCell align="center" colSpan={2}>माफिमिनाहा पाएका छुट संख्या</TableCell>
                                <TableCell align="center" colSpan={2}>मुलुकी फौजदारी कार्यविधी संहिता २०७४ को दफा १५५ अनुसार छुट संख्या</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" className='bg-secondary bg-gradient'>हाल सम्मको</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>यो महिनाको</TableCell>
                                <TableCell align="center" className='bg-secondary'>हाल सम्मको</TableCell>
                                <TableCell align="center" className='bg-secondary'>यो महिनाको</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>हाल सम्मको</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>यो महिनाको</TableCell>
                                <TableCell align="center" className='bg-secondary'>हाल सम्मको</TableCell>
                                <TableCell align="center" className='bg-secondary'>यो महिनाको</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">{parseInt(releasedCounts.TotalRegYear) + parseInt(releasedCounts.TotalDharautiYear)} </TableCell>
                                <TableCell align="center">{parseInt(releasedCounts.TotalRegMonth) + parseInt(releasedCounts.TotalDharautiMonth)}</TableCell>
                                <TableCell align="center">{releasedCounts.TotalWorkYear}</TableCell>
                                <TableCell align="center">{releasedCounts.TotalWorkMonth}</TableCell>
                                <TableCell align="center">{releasedCounts.TotalMafiYear}</TableCell>
                                <TableCell align="center">{releasedCounts.TotalMafiMonth}</TableCell>
                                <TableCell align="center">{releasedCounts.Total155Year}</TableCell>
                                <TableCell align="center">{releasedCounts.Total155Month}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="" colSpan={6}>{fy} सालको {fm} महिनाको मसान्तसम्मको बन्दी संख्याः</TableCell>
                            </TableRow>
                            <TableRow className='bg-primary bg-gradient'>
                                <TableCell align="center" >सि.नं.</TableCell>
                                <TableCell align="center" colSpan={0}>विवरण</TableCell>
                                <TableCell align="center" >पुरुष</TableCell>
                                <TableCell align="center" >महिला</TableCell>
                                <TableCell align="center" >जम्मा</TableCell>
                                <TableCell align="center" >कैफियत</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow className=''>
                                <TableCell align="center">१</TableCell>
                                <TableCell align="" colSpan={0}>अघिल्लाो महिनाको संख्या</TableCell>
                                <TableCell align="center" >{releasedCounts.TotalPrevMaleMonth}</TableCell>
                                <TableCell align="center" >{releasedCounts.TotalPrevFemaleMonth}</TableCell>
                                <TableCell align="center" >{parseInt(releasedCounts.TotalPrevMaleMonth) + parseInt(releasedCounts.TotalPrevFemaleMonth)}</TableCell>
                                <TableCell align="center" ></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center">२</TableCell>
                                <TableCell align="" colSpan={0}>यस महिनाको थप संख्या</TableCell>
                                <TableCell align="center" >{totals.TotalMaleArrestedInDateRange}</TableCell>
                                <TableCell align="center" >{totals.TotalFemaleArrestedInDateRange}</TableCell>
                                <TableCell align="center" >{totals.SumOfArrestedInDateRange}</TableCell>
                                <TableCell align="center" ></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center">३</TableCell>
                                <TableCell align="" colSpan={0}>यस महिनाको छुटेका संख्या</TableCell>
                                <TableCell align="center"> {releasedCounts.TotalRegMaleMonth}</TableCell>
                                <TableCell align="center"> {releasedCounts.TotalRegFemaleMonth}</TableCell>
                                <TableCell align="center"> {parseInt(releasedCounts.TotalRegMaleMonth) + parseInt(releasedCounts.TotalRegFemaleMonth)}</TableCell>
                                <TableCell align="center"></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center">४</TableCell>
                                <TableCell align="" colSpan={0}>यस महिनामा सरुवा भएको संख्या</TableCell>
                                <TableCell align="center">{releasedCounts.TotalTransferMaleMonth}</TableCell>
                                <TableCell align="center">{releasedCounts.TotalTransferFemaleMonth}</TableCell>
                                <TableCell align="center">{parseInt(releasedCounts.TotalTransferMaleMonth) + parseInt(releasedCounts.TotalTransferFemaleMonth)}</TableCell>
                                <TableCell align="center"></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center">५</TableCell>
                                <TableCell align="" colSpan={0}>यस महिनामा मृत्यु भएको संख्या</TableCell>
                                <TableCell align="center">०</TableCell>
                                <TableCell align="center">०</TableCell>
                                <TableCell align="center">०</TableCell>
                                <TableCell align="center"></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center">६</TableCell>
                                <TableCell align="" colSpan={0}>यस महिनामा कायम रहेको कैदीबन्दी संख्या</TableCell>
                                <TableCell align="center" >{parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale)}</TableCell>
                                <TableCell align="center" >{parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale)}</TableCell>
                                <TableCell align="center" >
                                    {parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale) + parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale)}
                                </TableCell>
                                <TableCell align="center" ></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center">७</TableCell>
                                <TableCell align="" colSpan={0}>हालको आश्रित बालबालिकाको संख्या</TableCell>
                                <TableCell align="center" >{totals.Maashrit}</TableCell>
                                <TableCell align="center" >{totals.Faashrit}</TableCell>
                                <TableCell align="center" >{totals.TotalAashrit}</TableCell>
                                <TableCell align="center" ></TableCell>

                            </TableRow>
                            <TableRow className=''>
                                <TableCell align="center"></TableCell>
                                <TableCell align="" colSpan={0}>जम्मा</TableCell>
                                <TableCell align="center" >
                                    {parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale) + parseInt(totals.Maashrit)}
                                </TableCell>
                                <TableCell align="center" >{parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale) + parseInt(totals.Faashrit)}</TableCell>
                                <TableCell align="center" >
                                    {parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale)+ parseInt(totals.KaidiFemale)+ parseInt(totals.ThunuwaFemale) + parseInt(totals.TotalAashrit)}
                                </TableCell>
                                <TableCell align="center" ></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={20}>मुद्दा अनुसारको स्वदेशी कैदीबन्दीहरुको संख्याः</TableCell>
                            </TableRow>
                            <TableRow className='bg-primary bg-gradient'>
                                <TableCell align="center" rowSpan={2}>सि.नं.</TableCell>
                                <TableCell align="center" rowSpan={2}>मुद्दा</TableCell>
                                <TableCell align="center" colSpan={3}>जम्मा</TableCell>
                                <TableCell align="center" colSpan={2}>पुरुष</TableCell>
                                <TableCell align="center" colSpan={2}>महिला</TableCell>
                                {totals.TotalAashrit > 0 && <TableCell align="center" colSpan={2}>आश्रित</TableCell>}
                                {totals.TotalNabalkrNabalik > 0 && <TableCell align="center" colSpan={2}>नाबालक/नाबालिका</TableCell>}
                                <TableCell align="center" colSpan={2}>६५ वर्ष माथिका</TableCell>
                                <TableCell align="center" rowSpan={2}>कैफियत</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
                                <TableCell align="center" className='bg-secondary fw-bold'>जम्मा</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>थुनुवा</TableCell>
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
                                {totals.TotalAashrit > 0 && <>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>नाबालक</TableCell>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>नाबालिका</TableCell>
                                </>}
                                {totals.TotalNabalkrNabalik > 0 && <>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>कैदी</TableCell>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>थुनुवा</TableCell>
                                </>}
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
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
                                    <TableCell align='center' className='bg-gradient'>{record.KaidiMale}</TableCell>
                                    <TableCell align='center' className='bg-gradient'>{record.ThunuwaMale}</TableCell>
                                    <TableCell align='center'>{record.KaidiFemale}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaFemale}</TableCell>
                                    {totals.TotalAashrit > 0 &&
                                        <><TableCell align='center' className='bg-gradient'>{record.Maashrit}</TableCell>
                                            <TableCell align='center' className='bg-gradient'>{record.Faashrit}</TableCell>
                                        </>}
                                    {totals.TotalNabalkTotalAashritrNabalik > 0 &&
                                        <><TableCell align='center' className='bg-gradient'>{record.KaidiNabalak}</TableCell>
                                            <TableCell align='center' className='bg-gradient'>{record.ThunuwaNabalak}</TableCell>
                                        </>}


                                    <TableCell align='center'>{record.KaidiAgeAbove65}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaAgeAbove65}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key='total' >
                                <TableCell className='bg-primary fw-bold' colSpan={2}>जम्मा</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.KaidiTotal) + parseInt(totals.ThunuwaTotal)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiFemale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaFemale}</TableCell>
                                {totals.TotalAashrit > 0 && <>
                                    <TableCell align='center' className='bg-success fw-bold'>{totals.Maashrit}</TableCell>
                                    <TableCell align='center' className='bg-success fw-bold'>{totals.Faashrit}</TableCell>
                                </>}
                                {
                                    totals.TotalNabalkrNabalik > 0 && <>
                                        <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiNabalak}</TableCell>
                                        <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaNabalak}</TableCell>
                                    </>}                                
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiAgeAbove65}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaAgeAbove65}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={20}>मुद्दा अनुसारको स्वदेशी कैदीबन्दीहरुको संख्याः</TableCell>
                            </TableRow>
                            <TableRow className='bg-primary bg-gradient'>
                                <TableCell align="center" rowSpan={2}>सि.नं.</TableCell>
                                <TableCell align="center" rowSpan={2}>मुद्दा</TableCell>
                                <TableCell align="center" colSpan={3}>जम्मा</TableCell>
                                <TableCell align="center" colSpan={2}>पुरुष</TableCell>
                                <TableCell align="center" colSpan={2}>महिला</TableCell>
                                {totals.TotalAashrit > 0 && <TableCell align="center" colSpan={2}>आश्रित</TableCell>}
                                {totals.TotalNabalkrNabalik > 0 && <TableCell align="center" colSpan={2}>नाबालक/नाबालिका</TableCell>}
                                <TableCell align="center" colSpan={2}>६५ वर्ष माथिका</TableCell>
                                <TableCell align="center" rowSpan={2}>कैफियत</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
                                <TableCell align="center" className='bg-secondary fw-bold'>जम्मा</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary bg-gradient'>थुनुवा</TableCell>
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
                                {totals.TotalAashrit > 0 && <>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>नाबालक</TableCell>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>नाबालिका</TableCell>
                                </>}
                                {totals.TotalNabalkrNabalik > 0 && <>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>कैदी</TableCell>
                                    <TableCell align="center" className='bg-secondary bg-gradient'>थुनुवा</TableCell>
                                </>}
                                <TableCell align="center" className='bg-secondary'>कैदी</TableCell>
                                <TableCell align="center" className='bg-secondary'>थुनुवा</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {foreignrecords.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell align='center'>{index + 1}</TableCell>
                                    <TableCell>{record.CaseNameNP}</TableCell>
                                    <TableCell align='center'>{record.KaidiTotal}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaTotal}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.ThunuwaTotal) + parseInt(record.KaidiTotal)}</TableCell>
                                    <TableCell align='center' className='bg-gradient'>{record.KaidiMale}</TableCell>
                                    <TableCell align='center' className='bg-gradient'>{record.ThunuwaMale}</TableCell>
                                    <TableCell align='center'>{record.KaidiFemale}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaFemale}</TableCell>
                                    {totals.TotalAashrit > 0 &&
                                        <><TableCell align='center' className='bg-gradient'>{record.Maashrit}</TableCell>
                                            <TableCell align='center' className='bg-gradient'>{record.Faashrit}</TableCell>
                                        </>}
                                    {totals.TotalNabalkTotalAashritrNabalik > 0 &&
                                        <><TableCell align='center' className='bg-gradient'>{record.KaidiNabalak}</TableCell>
                                            <TableCell align='center' className='bg-gradient'>{record.ThunuwaNabalak}</TableCell>
                                        </>}


                                    <TableCell align='center'>{record.KaidiAgeAbove65}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaAgeAbove65}</TableCell>
                                    <TableCell align='center'>{record.CountryName}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key='total' >
                                <TableCell className='bg-primary fw-bold' colSpan={2}>जम्मा</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.KaidiTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.ThunuwaTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(foreignTotals.KaidiTotal) + parseInt(foreignTotals.ThunuwaTotal)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.KaidiMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.ThunuwaMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.KaidiFemale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.ThunuwaFemale}</TableCell>
                                {totals.TotalAashrit > 0 && <>
                                    <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.Maashrit}</TableCell>
                                    <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.Faashrit}</TableCell>
                                </>}
                                {
                                    totals.TotalNabalkrNabalik > 0 && <>
                                        <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.KaidiNabalak}</TableCell>
                                        <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.ThunuwaNabalak}</TableCell>
                                    </>}                                
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.KaidiAgeAbove65}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{foreignTotals.ThunuwaAgeAbove65}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>                    
                </TableContainer>
            </div>
        </>
    )
}

export default CountPoliceReport
