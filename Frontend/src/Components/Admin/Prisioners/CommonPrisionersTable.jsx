import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, TableSortLabel
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import NepaliDate from 'nepali-datetime';

const CommonPrisionersTable = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'release_date', direction: 'asc' });
    const { caseName, type } = useParams();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

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

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedArray = [...filteredRecords].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // Special case: calculate remaining days for release_date
            if (key === 'release_date') {
                aValue = Math.ceil((new Date(a.release_date) - new Date(formattedDateNp)) / (1000 * 60 * 60 * 24));
                bValue = Math.ceil((new Date(b.release_date) - new Date(formattedDateNp)) / (1000 * 60 * 60 * 24));
            }

            // Convert to number if comparing age or remaining days
            if (key === 'age' || key === 'release_date') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            // Convert to date if comparing date fields
            if (key === 'arrested' || key === 'karagar_date') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            // Convert to date if comparing date fields
            if (key === 'case_np') {
                // Simply compare the strings alphabetically (ignoring case)
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (key === 'name_np') {
                // Simply compare the strings alphabetically (ignoring case)
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (key === 'prisioner_type') {
                // Simply compare the strings alphabetically (ignoring case)
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (key === 'duration') {
                // Simply compare the strings alphabetically (ignoring case)
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setRecords(sortedArray);
        setSortConfig({ key, direction });
    };


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
                                                                             
                            <TableCell sortDirection={sortConfig.key === 'prisioner_type' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'prisioner_type'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('prisioner_type')}
                                >
                                    कैदीको प्रकार
                                </TableSortLabel>
                            </TableCell>
                            
                            <TableCell sortDirection={sortConfig.key === 'name_np' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'name_np'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('name_np')}
                                >
                                    नाम नेपालीमा
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>जाहेरवाला</TableCell>

                            <TableCell sortDirection={sortConfig.key === 'case_np' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'case_np'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('case_np')}
                                >
                                    मुद्दा
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>ठेगाना</TableCell>

                            <TableCell sortDirection={sortConfig.key === 'age' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'age'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('age')}
                                >
                                    उमेर
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={sortConfig.key === 'arrested' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'arrested'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('arrested')}
                                >
                                    थुना परेको मिति
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={sortConfig.key === 'karagar_date' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'karagar_date'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('karagar_date')}
                                >
                                    कारागार परेको मिति
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>छुट्ने मिति</TableCell>

                            <TableCell sortDirection={sortConfig.key === 'formattedDuration' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'formattedDuration'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('formattedDuration')}
                                >
                                     कैद अवधी                                     
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={sortConfig.key === 'release_date' ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig.key === 'release_date'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('release_date')}
                                >
                                    बाँकी कैद
                                </TableSortLabel>
                            </TableCell>
                            <TableCell colSpan={2} className="text-center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record, index) => {
                                // Calculate duration in years, months, and days
                                const arrestDate = new Date(record.arrested);
                                const karagarDate = new Date(record.karagar_date);
                                const releaseDate = new Date(record.release_date);
                                const startDate = arrestDate || karagarDate;
                                const duration = Math.floor((releaseDate - startDate) / (1000 * 60 * 60 * 24));
                                const years = Math.floor(duration / 365);
                                const months = Math.floor((duration % 365) / 30);
                                const days = duration % 30;
                                // const formattedDuration = `${years}|${months}|${days}|`;
                                const formattedDuration = years;
                                // Calculate remaining days for release_date
                                const remainingDays = record.release_date
                                    ? Math.ceil(
                                        (new Date(record.release_date) - new Date(formattedDateNp)) / (1000 * 60 * 60 * 24)
                                    )
                                    : '';

                                return (
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
                                        <TableCell>{formattedDuration}</TableCell>
                                        <TableCell>{remainingDays}</TableCell>
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
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={13} align="center">
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
