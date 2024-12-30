import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PoliceRecordsTable = ({ records, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>दर्जा</TableCell>
                        <TableCell>नाम नेपालीमा</TableCell>
                        <TableCell>नाम (अंग्रेजीमा)</TableCell>
                        <TableCell>ठेगाना</TableCell>
                        <TableCell>कार्यरत मिती</TableCell>
                        <TableCell>सम्पर्क नं.</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell>{record.rank_np}</TableCell>
                            <TableCell>{record.name_np}</TableCell>
                            <TableCell>{record.name_en}</TableCell>
                            <TableCell>{record.address}</TableCell>
                            <TableCell>{record.working_from}</TableCell>
                            <TableCell>{record.contact}</TableCell>
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

export default PoliceRecordsTable;
