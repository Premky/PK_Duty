import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PoliceRecordsTable = ({ records, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>सि.नं.</TableCell>
                        <TableCell>दर्जा</TableCell>
                        <TableCell>नाम</TableCell>
                        <TableCell>कम्प्युटर कोड</TableCell>
                        <TableCell>संकेत नं.</TableCell>
                        <TableCell>ठेगाना</TableCell>
                        <TableCell>भर्ना मिती</TableCell>
                        <TableCell>कार्यरत मिती</TableCell>
                        <TableCell>सम्पर्क नं.</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((record,index) => (
                        <TableRow key={record.id}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{record.ranknp}</TableCell>
                            <TableCell>{record.name_np} <br />{record.name_en}</TableCell>
                            <TableCell>{record.pmis}</TableCell>
                            <TableCell>{record.sanket}</TableCell>
                            <TableCell>{record.address}</TableCell>
                            <TableCell>{record.recruit_date}</TableCell>
                            <TableCell>{record.working_from}</TableCell>
                            <TableCell>{record.contact}</TableCell>
                            <TableCell>
                                <Button onClick={() => onEdit(record)} variant="outlined" color="primary">
                                    Edit
                                </Button>
                                {/* <Button onClick={() => onDelete(record.id)} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                                    Delete
                                </Button> */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PoliceRecordsTable;
