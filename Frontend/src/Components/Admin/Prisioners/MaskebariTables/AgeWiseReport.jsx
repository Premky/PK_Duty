import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const CountAgeWiseTableBody = ({ records, totals, startDate, endDate }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow className="bg-primary">
            <TableCell align="center" rowSpan={2}>सि.नं.</TableCell>
            <TableCell align="center" rowSpan={2}>मुद्दा</TableCell>
            <TableCell align="center" colSpan={2}>15-20 वर्ष</TableCell>
            <TableCell align="center" colSpan={2}>20-25 वर्ष</TableCell>
            <TableCell align="center" colSpan={2}>25-30 वर्ष</TableCell>
            <TableCell align="center" colSpan={2}>जम्मा</TableCell>
            <TableCell align="center" rowSpan={2}>आएको संख्या</TableCell>
            <TableCell align="center" rowSpan={2}>छुटेको संख्या</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" className="bg-secondary">कैदी</TableCell>
            <TableCell align="center" className="bg-secondary">थुनुवा</TableCell>
            <TableCell align="center" className="bg-secondary">कैदी</TableCell>
            <TableCell align="center" className="bg-secondary">थुनुवा</TableCell>
            <TableCell align="center" className="bg-secondary">कैदी</TableCell>
            <TableCell align="center" className="bg-secondary">थुनुवा</TableCell>
            <TableCell align="center" className="bg-secondary">कैदी</TableCell>
            <TableCell align="center" className="bg-secondary">थुनुवा</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>
                <Link to={`/police/details/${record.CaseNameNP}`}>{record.CaseNameNP}</Link>
              </TableCell>
              <TableCell align="center">{record.Kaidi_15_20}</TableCell>
              <TableCell align="center">{record.Thunuwa_15_20}</TableCell>
              <TableCell align="center">{record.Kaidi_20_25}</TableCell>
              <TableCell align="center">{record.Thunuwa_20_25}</TableCell>
              <TableCell align="center">{record.Kaidi_25_30}</TableCell>
              <TableCell align="center">{record.Thunuwa_25_30}</TableCell>
              <TableCell align="center" className="fw-bold">{record.KaidiTotal}</TableCell>
              <TableCell align="center" className="fw-bold">{record.ThunuwaTotal}</TableCell>
              <TableCell align="center">
                <Link to={`/police/details/${record.CaseNameNP}/in/${startDate}/to/${endDate}`}>
                  {record.TotalArrestedInDateRange}
                </Link>
              </TableCell>
              <TableCell align="center">{record.TotalReleasedInDateRange}</TableCell>
            </TableRow>
          ))}
          {/* Totals Row */}
          <TableRow key="total">
            <TableCell className="bg-primary fw-bold" colSpan={2}>जम्मा</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.Kaidi_15_20}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.Thunuwa_15_20}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.Kaidi_20_25}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.Thunuwa_20_25}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.Kaidi_25_30}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.Thunuwa_25_30}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.KaidiTotal}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.ThunuwaTotal}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.SumOfArrestedInDateRange}</TableCell>
            <TableCell align="center" className="bg-success fw-bold">{totals.SumOfReleasedInDateRange}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CountAgeWiseTableBody;
