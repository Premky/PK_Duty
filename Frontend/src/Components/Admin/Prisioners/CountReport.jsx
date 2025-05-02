import { useTheme } from '@emotion/react';
import axios from 'axios';
import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import NepaliDate from 'nepali-datetime';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Button, FormControl, Container, Select, InputLabel, MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Logout from '../../Login/Logout';
import { exportToExcel } from './ExportToExcel';
import ExcelJS from 'exceljs';
import ReleasedPrisionersTable from './MaskebariTables/ReleasedPrisionersTable';
import CurrentCountTable from './MaskebariTables/CurrentCountTable';
import CountryWiseReport from './MaskebariTables/CountryWiseReport';

// Initial Date Setup
const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY');
const fm = new NepaliDate().format('MM');
const fy_date = `${fy}-4-1`;

const CountPoliceReport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

    // React Hook Form setup
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm({
        defaultValues: {
            startDate: formattedDateNp,
            endDate: formattedDateNp,
        },
    });

    const [currentData, setCurrentData] = useState();
    const [isLoading, startTransition] = useTransition();
    const [editing, setEditing] = useState(false);
    const [records, setRecords] = useState([]);
    const [foreignrecords, setForeignRecords] = useState([]);
    const [totals, setTotals] = useState({});
    const [foreignTotals, setForeignTotals] = useState({});
    const [releasedCounts, setReleasedCounts] = useState([]);

    // API fetch function
    const fetchData = async (url, params, setStateFunction) => {
        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                params,
                withCredentials: true,
            });
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setStateFunction(Result);
                } else {
                    console.log('No records found');
                }
            } else {
                console.error(Error || 'Failed to fetch records');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data.');
        }
    };

    // Fetch records for Nepali Prisoners
    const fetchNepaliRecords = (data) => {
        const params = { startDate: data?.startDate || formattedDateNp, endDate: data?.endDate || formattedDateNp, type: 'nepali' };
        fetchData(`${BASE_URL}/prisioner/get_prisoners_report`, params, (result) => {
            console.log('Nepali Records:', result);  // Log data here
            setRecords(result);
        });
    };
    

    // Fetch records for Foreign Prisoners
    const fetchForeignRecords = (data) => {
        const params = { startDate: data?.startDate || formattedDateNp, endDate: data?.endDate || formattedDateNp, type: 'foreign' };
        fetchData(`${BASE_URL}/prisioner/get_prisoners_report`, params, (result) => {
            console.log('Foreign Records:', result);  // Log data here
            setForeignRecords(result);
        });
    };

    // Fetch released counts
    const fetchReleasedCounts = (data) => {
        const params = { endDate: data?.endDate || formattedDateNp };
        fetchData(`${BASE_URL}/prisioner/get_released_counts`, params, (result) => setReleasedCounts(result[0] || []));
    };

    // Calculate totals for records
    const calculateTotals = (data) => {
        const totals = data.reduce((acc, record) => {
            return {
                KaidiTotal: acc.KaidiTotal + (parseInt(record.KaidiTotal) || 0),
                ThunuwaTotal: acc.ThunuwaTotal + (parseInt(record.ThunuwaTotal) || 0),
                KaidiMale: acc.KaidiMale + (parseInt(record.KaidiMale) || 0),
                KaidiFemale: acc.KaidiFemale + (parseInt(record.KaidiFemale) || 0),
                ThunuwaMale: acc.ThunuwaMale + (parseInt(record.ThunuwaMale) || 0),
                ThunuwaFemale: acc.ThunuwaFemale + (parseInt(record.ThunuwaFemale) || 0),
                Total: acc.Total + (parseInt(record.Total) || 0),
            };
        }, {
            KaidiTotal: 0, ThunuwaTotal: 0, KaidiMale: 0, KaidiFemale: 0, ThunuwaMale: 0, ThunuwaFemale: 0, Total: 0,
        });

        setTotals(totals);
    };

    // Export data to Excel
    const exportMaskebari = async () => {
        await exportToExcel(releasedCounts, records, totals, foreignrecords, foreignTotals, fy, fm);
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchNepaliRecords(); // For Nepali Prisoners
        fetchForeignRecords(); // For Foreign Prisoners
        fetchReleasedCounts(); // Fetch Released Counts
    }, []); // This effect runs once on mount

    useEffect(() => {
        calculateTotals(records);
    }, [records]);

    return (
        <div>
            <div className="report_title text-center bg-info bg-gradient p-2">
                कारागार कार्यालयको मास्केवारी विवरण
            </div>

            {/* Form for date range selection */}
            <form className="row" onSubmit={handleSubmit(fetchNepaliRecords)}>
                <label htmlFor="startDate" className="col-xl-1 col-md-1 col-sm-12">देखी<span>*</span></label>
                <div className="col-xl-2 col-md-3 col-sm-12">
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                </div>

                <label htmlFor="endDate" className="col-xl-1 col-md-1 col-sm-12">सम्म<span>*</span></label>
                <div className="col-xl-2 col-md-3 col-sm-12">
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                </div>

                {/* Button for exporting data */}
                <div className="col-xl-2 col-md-3 col-sm-12">
                    <Button variant="contained" onClick={exportMaskebari}>Export to Excel</Button>
                </div>
            </form>

            {/* Tables for displaying reports */}
            {/* <Box my={2}>
                {records.length === 0 ? (
                    <p>No Nepali Prisoner records found</p>
                ) : (
                    <ReleasedPrisionersTable data={releasedCounts} />
                )}
            </Box> */}
            <div className="report_data">
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <ReleasedPrisionersTable releasedCounts={releasedCounts} />

                    <CurrentCountTable releasedCounts={releasedCounts} totals={totals} foreignTotals={foreignTotals} fy={fy} fm={fm} />

                    <CountryWiseReport records={records} totals={totals} type={'nepali'}/>

                    <CountryWiseReport records={foreignrecords} totals={foreignTotals} type={'foreigners'}/>

                </TableContainer>
            </div>
        </div>
    );
};

export default CountPoliceReport;
