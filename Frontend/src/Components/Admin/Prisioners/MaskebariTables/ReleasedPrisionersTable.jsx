import React from 'react'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button,
    FormControl, Container, Select, InputLabel,
    MenuItem
} from '@mui/material';
const ReleasedPrisionersTable = ({releasedCounts}) => {
    
    return (
        <>
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
        </>
    )
}

export default ReleasedPrisionersTable
