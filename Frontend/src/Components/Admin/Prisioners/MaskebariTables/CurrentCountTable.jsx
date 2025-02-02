import React from 'react'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button,
    FormControl, Container, Select, InputLabel,
    MenuItem
} from '@mui/material';

const CurrentCountTable = ({releasedCounts, totals, fy, fm}) => {
    return (
        <>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align="" colSpan={6}>{fy} सालको {fm} महिनाको मसान्तसम्मको बन्दी संख्याः</TableCell>
                    </TableRow>
                    <TableRow className='bg-primary bg-gradient'>
                        <TableCell align="center" >सि.नं.</TableCell>
                        <TableCell align="center" colSpan={0}>विवरण</TableCell>
                        <TableCell align="center" >पुरुष</TableCell>
                        <TableCell align="center" >महिला</TableCell>
                        <TableCell align="center" >जम्मा</TableCell>
                        <TableCell align="center" >कैफियत</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow className=''>
                        <TableCell align="center">१</TableCell>
                        <TableCell align="" colSpan={0}>अघिल्लाो महिनाको संख्या</TableCell>
                        <TableCell align="center" >{releasedCounts.TotalPrevMaleMonth}</TableCell>
                        <TableCell align="center" >{releasedCounts.TotalPrevFemaleMonth}</TableCell>
                        <TableCell align="center" >{parseInt(releasedCounts.TotalPrevMaleMonth) + parseInt(releasedCounts.TotalPrevFemaleMonth)}</TableCell>
                        <TableCell align="center" ></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center">२</TableCell>
                        <TableCell align="" colSpan={0}>यस महिनाको थप संख्या</TableCell>
                        <TableCell align="center" >{totals.TotalMaleArrestedInDateRange}</TableCell>
                        <TableCell align="center" >{totals.TotalFemaleArrestedInDateRange}</TableCell>
                        <TableCell align="center" >{totals.SumOfArrestedInDateRange}</TableCell>
                        <TableCell align="center" ></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center">३</TableCell>
                        <TableCell align="" colSpan={0}>यस महिनाको छुटेका संख्या</TableCell>
                        <TableCell align="center"> {releasedCounts.TotalRegMaleMonth}</TableCell>
                        <TableCell align="center"> {releasedCounts.TotalRegFemaleMonth}</TableCell>
                        <TableCell align="center"> {parseInt(releasedCounts.TotalRegMaleMonth) + parseInt(releasedCounts.TotalRegFemaleMonth)}</TableCell>
                        <TableCell align="center"></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center">४</TableCell>
                        <TableCell align="" colSpan={0}>यस महिनामा सरुवा भएको संख्या</TableCell>
                        <TableCell align="center">{releasedCounts.TotalTransferMaleMonth}</TableCell>
                        <TableCell align="center">{releasedCounts.TotalTransferFemaleMonth}</TableCell>
                        <TableCell align="center">{parseInt(releasedCounts.TotalTransferMaleMonth) + parseInt(releasedCounts.TotalTransferFemaleMonth)}</TableCell>
                        <TableCell align="center"></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center">५</TableCell>
                        <TableCell align="" colSpan={0}>यस महिनामा मृत्यु भएको संख्या</TableCell>
                        <TableCell align="center">०</TableCell>
                        <TableCell align="center">०</TableCell>
                        <TableCell align="center">०</TableCell>
                        <TableCell align="center"></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center">६</TableCell>
                        <TableCell align="" colSpan={0}>यस महिनामा कायम रहेको कैदीबन्दी संख्या</TableCell>
                        <TableCell align="center" >{parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale)}</TableCell>
                        <TableCell align="center" >{parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale)}</TableCell>
                        <TableCell align="center" >
                            {parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale) + parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale)}
                        </TableCell>
                        <TableCell align="center" ></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center">७</TableCell>
                        <TableCell align="" colSpan={0}>हालको आश्रित बालबालिकाको संख्या</TableCell>
                        <TableCell align="center" >{totals.Maashrit}</TableCell>
                        <TableCell align="center" >{totals.Faashrit}</TableCell>
                        <TableCell align="center" >{totals.TotalAashrit}</TableCell>
                        <TableCell align="center" ></TableCell>

                    </TableRow>
                    <TableRow className=''>
                        <TableCell align="center"></TableCell>
                        <TableCell align="" colSpan={0}>जम्मा</TableCell>
                        <TableCell align="center" >
                            {parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale) + parseInt(totals.Maashrit)}
                        </TableCell>
                        <TableCell align="center" >{parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale) + parseInt(totals.Faashrit)}</TableCell>
                        <TableCell align="center" >
                            {parseInt(totals.KaidiMale) + parseInt(totals.ThunuwaMale) + parseInt(totals.KaidiFemale) + parseInt(totals.ThunuwaFemale) + parseInt(totals.TotalAashrit)}
                        </TableCell>
                        <TableCell align="center" ></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}

export default CurrentCountTable
