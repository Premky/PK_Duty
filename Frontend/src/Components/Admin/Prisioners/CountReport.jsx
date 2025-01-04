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
// import Select from '@mui/material'


import Logout from '../../Login/Logout'
import { useActionState } from 'react'

const CountPrisionerReport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();

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

    const fetchRecords = async () => {
        // if (!data) { data = nul`l }
        try {
            const url = `${BASE_URL}/prisioner/get_report`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // If cookies are required
            });

            // const response = await axios.get(`${BASE_URL}/prisioner/get_report`,{headers: { Authorization: `Bearer ${token}` }});

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
                KaidiAgeAbove65: 0, ThunuwaAgeAbove65: 0, Nabalak:0, Nabalika:0, Total: 0
            }
        );
        setTotals(totals);
    };

    useEffect(() => {
        fetchRecords();
    }, [])

    return (
        <>
            <div className="report_title">
                संख्यात्मक विवरण
            </div>
            <div className="report_data">
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" rowSpan={2}>सि.नं.</TableCell>
                                <TableCell align="center" rowSpan={2}>मुद्दा</TableCell>
                                <TableCell align="center" colSpan={2}>जम्मा</TableCell>
                                <TableCell align="center" colSpan={2}>पुरुष</TableCell>
                                <TableCell align="center" colSpan={2}>महिला</TableCell>
                                <TableCell align="center" colSpan={2}>६५ वर्ष माथिका</TableCell>
                                <TableCell align="center" colSpan={2}>नाबालक/आश्रीत</TableCell>
                                <TableCell align="center">कैफियत</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">कैदी</TableCell>
                                <TableCell align="center">थुनुवा</TableCell>
                                <TableCell align="center">कैदी</TableCell>
                                <TableCell align="center">थुनुवा</TableCell>
                                <TableCell align="center">कैदी</TableCell>
                                <TableCell align="center">थुनुवा</TableCell>
                                <TableCell align="center">कैदी</TableCell>
                                <TableCell align="center">थुनुवा</TableCell>
                                <TableCell align="center">पुरुष</TableCell>
                                <TableCell align="center">महिला</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {records.map((record, index) => (
                                <TableRow key={record.id}>
                                    <TableCell align='center'>{index + 1}</TableCell>
                                    <TableCell>{record.CaseNameNP}</TableCell>
                                    <TableCell align='center'>{record.KaidiTotal}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaTotal}</TableCell>
                                    <TableCell align='center'>{record.KaidiMale}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaMale}</TableCell>
                                    <TableCell align='center'>{record.KaidiFemale}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaFemale}</TableCell>
                                    <TableCell align='center'>{record.KaidiAgeAbove65}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaAgeAbove65}</TableCell>
                                    <TableCell align='center'>{record.Nabalak}</TableCell>
                                    <TableCell align='center'>{record.Nabalika}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key='total' >
                                <TableCell colSpan={2}>जम्मा</TableCell>
                                <TableCell align='center'>{totals.KaidiTotal}</TableCell>
                                <TableCell align='center'>{totals.ThunuwaTotal}</TableCell>
                                <TableCell align='center'>{totals.KaidiMale}</TableCell>
                                <TableCell align='center'>{totals.ThunuwaMale}</TableCell>
                                <TableCell align='center'>{totals.KaidiFemale}</TableCell>
                                <TableCell align='center'>{totals.ThunuwaFemale}</TableCell>
                                <TableCell align='center'>{totals.KaidiAgeAbove65}</TableCell>
                                <TableCell align='center'>{totals.ThunuwaAgeAbove65}</TableCell>
                                <TableCell align='center'>{totals.Nabalak}</TableCell>
                                <TableCell align='center'>{totals.Nabalika}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default CountPrisionerReport
