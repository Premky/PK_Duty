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
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'
import * as XLSX from 'xlsx';
const CountPoliceReport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // const today = new Date();
    // const sevenDaysAgo = new Date(today);
    // sevenDaysAgo.setDate(today.getDate() - 7);
    // console.log('Seven Days Ago:', sevenDaysAgo); // Check this value

    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    // const datebefore7days = new NepaliDate(npToday)
    // datebefore7days.setDate(npToday.getDate() - 7);
    // const formatteddatebefore7days = datebefore7days.format('YYYY-MM-DD');

    let formatteddatebefore7days = formattedDateNp;
    try {
        const datebefore7days = new NepaliDate(npToday);
        console.log(datebefore7days)
        const currentNepaliDate = { year: dateData.year, month: dateData.month, day: dateData.day };
        const currentEnglishDate = { year: dateData.yearEn, month: dateData.monthEn + 1, day: dateData.dayEn }; // Adjust monthEn to 1-based

        // Calculate 7 days before
        const nepaliDateBefore7Days = calculateNepaliDate(currentNepaliDate.year, currentNepaliDate.month, currentNepaliDate.day, 7);
        const englishDateBefore7Days = calculateEnglishDate(currentEnglishDate.year, currentEnglishDate.month - 1, currentEnglishDate.day, 7); // Convert month to 0-based for Date object
        // datebefore7days.setDate(npToday.getDate() - 7);
        // formatteddatebefore7days = datebefore7days.format('YYYY-MM-DD');        

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
        Total: 0,
    });

    const [start_Date, setStart_Date] = useState(formatteddatebefore7days);
    const [end_Date, setEnd_Date] = useState(formattedDateNp);

    const fetchRecords = async (data) => {
        // if (!data) { data = nul`l }
        // console.log(data)
        try {
            const url = `${BASE_URL}/common/get_prisioners_report`;

            const queryParams = new URLSearchParams({
                startDate: data?.startDate || formatteddatebefore7days,
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

    const exportToExcel = () => {
        // Headers for the Excel sheet
        const headers = [
            [`मिति ${start_Date} गतेबाट ${end_Date} सम्म कारागार कार्यालय संखुवासभामा रहेका कैदीबन्दीहरुको मुद्दागत जाहेरी`],
            ['सि.नं.', 'मुद्दा', 'जम्मा', '', '', 'कैदी', '', '', 'थुनुवा', '', '', 'आएको संख्या', 'छुटेको संख्या', 'कैफियत'],
            ['', '', 'कैदी', 'थुनुवा', 'जम्मा', 'पुरुष', 'महिला', 'जम्मा', 'पुरुष', 'महिला', 'जम्मा', '', '', '']
        ];

        // Data for the rows
        const formattedData = records.map((record, index) => [
            index + 1,
            record.CaseNameNP,
            record.KaidiTotal,
            record.ThunuwaTotal,
            parseInt(record.KaidiTotal) + parseInt(record.ThunuwaTotal),
            record.KaidiMale,
            record.KaidiFemale,
            parseInt(record.KaidiMale) + parseInt(record.KaidiFemale),
            record.ThunuwaMale,
            record.ThunuwaFemale,
            parseInt(record.ThunuwaMale) + parseInt(record.ThunuwaFemale),
            record.TotalArrestedInDateRange,
            record.TotalReleasedInDateRange,
            record.Remarks
        ]);

        // Adding the totals row
        const totalsRow = [
            'जम्मा',
            '',
            totals.KaidiTotal,
            totals.ThunuwaTotal,
            totals.KaidiTotal + totals.ThunuwaTotal,
            totals.KaidiMale,
            totals.KaidiFemale,
            totals.KaidiMale + totals.KaidiFemale,
            totals.ThunuwaMale,
            totals.ThunuwaFemale,
            totals.ThunuwaMale + totals.ThunuwaFemale,
            totals.record.TotalArrestedInDateRange,
            totals.record.TotalReleasedInDateRange
        ];
        formattedData.push(totalsRow);

        const blankline = [
            '', '', '', '', '', '', '', '', '', '', ''
        ]
        formattedData.push(blankline);
        formattedData.push(blankline);
        formattedData.push(blankline);

        const otherdetails = [
            '', `मितिः ${formattedDateNp} गते ।`, '', '', '', '', '', '', '', '', 'तुलसी राम राई'
        ]
        formattedData.push(otherdetails);
        const otherdetails2 = [
            '', '', '', '', '', '', '', '', '', '', 'प्रहरी सहायक निरिक्षक'
        ]
        formattedData.push(otherdetails2);

        // Create a worksheet and a workbook
        const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...formattedData]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Prisoner Records');

        // Apply styling (e.g., bold headers, background color)
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];
            if (headerCell) {
                headerCell.s = { font: { bold: true }, fill: { fgColor: { rgb: 'D9EAD3' } } };
            }
        }

        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } }, // Merge cells for "Title"
            { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } }, // Merge cells for "सि.नं."
            { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } }, // Merge cells for "मुद्दा"
            { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } }, // Merge cells for "आएको संख्या"
            { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } }, // Merge cells for "गएको संख्या"
            { s: { r: 1, c: 13 }, e: { r: 2, c: 13 } }, // Merge cells for "कैफियत"
            { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } }, // Merge cells for "जम्मा"
            { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } }, // Merge cells for "कैदी"
            { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } }, // Merge cells for "थुनुवा"
            // { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } }, // Merge cells for "मिति"
            // { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } }, // Merge cells for "गार्ड प्रमुखको नाम"
        ];


        // Trigger download as an Excel file
        XLSX.writeFile(workbook, 'prisoner_records.xlsx');
    };

    useEffect(() => {
        fetchRecords();
    }, [])

    return (
        <>
            {/* <Link to='/police'>Police Form</Link> */}
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
                <button onClick={exportToExcel}>Export</button>
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
                                <TableCell align='center' className='bg-success fw-bold'>{totals.SumOfArrestedInDateRange}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.SumOfReleasedInDateRange}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default CountPoliceReport
