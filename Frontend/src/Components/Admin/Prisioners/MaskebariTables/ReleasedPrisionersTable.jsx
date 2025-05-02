import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button,
  FormControl, Container, Select, InputLabel, MenuItem
} from '@mui/material';

const ReleasedPrisionersTable = ({ releasedCounts }) => {
  // Check if releasedCounts is defined and has the necessary properties
//   if (!releasedCounts) {
//     return <p>Loading...</p>; // or any other placeholder to indicate data is loading
//   }
// console.log(releasedCounts, 'releasedCounts')
  return (
    <>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={8}>चालु आर्थिक वर्षमा छुटेका कैदीबन्दीको संख्याः</TableCell>
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
            <TableCell align="center">{parseInt(releasedCounts.TotalRegYear) + parseInt(releasedCounts.TotalDharautiYear) || 0}</TableCell>
            <TableCell align="center">{parseInt(releasedCounts.TotalRegMonth) + parseInt(releasedCounts.TotalDharautiMonth) || 0}</TableCell>
            <TableCell align="center">{releasedCounts.TotalWorkYear || 0}</TableCell>
            <TableCell align="center">{releasedCounts.TotalWorkMonth || 0}</TableCell>
            <TableCell align="center">{releasedCounts.TotalMafiYear || 0}</TableCell>
            <TableCell align="center">{releasedCounts.TotalMafiMonth || 0}</TableCell>
            <TableCell align="center">{releasedCounts.Total155Year || 0}</TableCell>
            <TableCell align="center">{releasedCounts.Total155Month || 0}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default ReleasedPrisionersTable;
