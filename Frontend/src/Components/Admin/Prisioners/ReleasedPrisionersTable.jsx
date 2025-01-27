import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import NepaliDate from 'nepali-datetime'

import EditIcon from '@mui/icons-material/Edit';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

const CommonPrisionersTable = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const [records, setRecords] = useState([]);
    
    const fetchRecords = async () => {
        try {
            // Define the URL directly
            const url = `${BASE_URL}/prisioner/get_released_prisioners`;
    
            // Make the request
            const response = await axios({
                method: 'GET',
                url,
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
    
            const { Status, Result, Error } = response.data;
    
            if (Status) {
                if (Result?.length > 0) {
                    setRecords(Result); // Set the fetched records
                    // console.log(Result);
                } else {
                    console.log("No Record Found");
                }
            } else {
                console.log(Error || 'Failed to fetch records.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            alert('An error occurred while fetching records.');
        }
    };
    

    

    const calculateTotals = (record) => {
        // console.log(data)
        const totals = record.reduce(
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
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>सि.नं.</TableCell>
                        <TableCell>कैदीको प्रकार</TableCell>
                        <TableCell>नाम नेपालीमा</TableCell>
                        <TableCell>जाहेरवाला</TableCell>
                        <TableCell>मुद्दा</TableCell>
                        <TableCell>ठेगाना</TableCell>
                        <TableCell>उमेर</TableCell>
                        <TableCell>कैदमुक्त मिति</TableCell>
                        <TableCell>कैदमुक्त कारण</TableCell>
                        <TableCell colSpan={2} className='text-center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((record, index) => (
                        <TableRow key={record.id}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{record.prisioner_type}</TableCell>
                            <TableCell>{record.name_np}</TableCell>
                            <TableCell>{record.jaherwala}</TableCell>
                            <TableCell>{record.case_np}</TableCell>
                            <TableCell>{record.address}</TableCell>
                            <TableCell>{record.age}</TableCell>
                            <TableCell>{record.release_date}</TableCell>
                            <TableCell>{record.release_reason}</TableCell>
                            <TableCell>
                                <Button onClick={() => onEdit(record)} variant="outlined" color="primary">
                                    <EditIcon/>
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => onDelete(record.id)} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                                    <DeleteSharpIcon/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CommonPrisionersTable;
