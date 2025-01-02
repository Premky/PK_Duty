import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PrisionersRecordTable = ({ records, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>सि.नं.</TableCell>
                        <TableCell>कैदीको प्रकार</TableCell>
                        <TableCell>नाम नेपालीमा</TableCell>
                        <TableCell>जाहेरवाला</TableCell>
                        <TableCell>मुद्दा</TableCell>
                        <TableCell>ठेगाना</TableCell>
                        <TableCell>उमेर</TableCell>
                        <TableCell>Actions</TableCell>
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
                            <TableCell>
                                <Button onClick={() => onEdit(record)} variant="outlined" color="primary">
                                    Edit
                                </Button>
                                <Button onClick={() => onDelete(record.id)} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PrisionersRecordTable;
