import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

const CommonPrisionersTable = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const { caseName, type } = useParams(); // Get params from route

    // Fetch all records
    const fetchRecords = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/prisioner/get_prisioners`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { Status, Result, Error } = response.data;

            if (Status) {
                setRecords(Result || []);
            } else {
                setError(Error || 'Failed to fetch records.');
            }
        } catch (err) {
            console.error('Error fetching records:', err);
            setError('An error occurred while fetching records.');
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    // Filter records by caseName and type
    const filteredRecords = caseName
        ? records.filter(record => record.case_np === caseName && (!type || record.prisioner_type === type))
        : records;

    // Placeholder functions for edit and delete
    const onEdit = (record) => {
        console.log('Edit record:', record);
    };

    const onDelete = (id) => {
        console.log('Delete record with ID:', id);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>सि.नं.</TableCell>
                            <TableCell>कैदीको प्रकार</TableCell>
                            <TableCell>नाम नेपालीमा</TableCell>
                            <TableCell>जाहेरवाला</TableCell>
                            <TableCell>मुद्दा</TableCell>
                            <TableCell>ठेगाना</TableCell>
                            <TableCell>उमेर</TableCell>
                            <TableCell>थुना परेको मिति</TableCell>
                            <TableCell>कारागार परेको मिति</TableCell>
                            <TableCell>छुट्ने मिति</TableCell>
                            <TableCell colSpan={2} className="text-center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record, index) => (
                                <TableRow key={record.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{record.prisioner_type}</TableCell>
                                    <TableCell>{record.name_np}</TableCell>
                                    <TableCell>{record.jaherwala}</TableCell>
                                    <TableCell>{record.case_np}</TableCell>
                                    <TableCell>{record.address}</TableCell>
                                    <TableCell>{record.age}</TableCell>
                                    <TableCell>{record.arrested}</TableCell>
                                    <TableCell>{record.karagar_date}</TableCell>
                                    <TableCell>{record.release_date}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => onEdit(record)} variant="outlined" color="primary">
                                            <EditIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => onDelete(record.id)} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                                            <DeleteSharpIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default CommonPrisionersTable;
