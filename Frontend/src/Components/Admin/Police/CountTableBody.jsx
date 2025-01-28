import React from 'react'

const CountTableBody = ({records}) => {
  return (
    <>
    <TableBody>
                            {records.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell align='center'>{index + 1}</TableCell>
                                    <TableCell>{record.CaseNameNP}</TableCell>
                                    <TableCell align='center'>{record.KaidiTotal}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaTotal}</TableCell>
                                    <TableCell align='center'>{parseInt(record.Nabalak) + parseInt(record.Nabalika)}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.ThunuwaTotal) + parseInt(record.KaidiTotal)}</TableCell>
                                    <TableCell align='center'>{record.KaidiMale}</TableCell>
                                    <TableCell align='center'>{record.KaidiFemale}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.KaidiMale) + parseInt(record.KaidiFemale)}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaMale}</TableCell>
                                    <TableCell align='center'>{record.ThunuwaFemale}</TableCell>
                                    <TableCell align='center' className='fw-bold'>{parseInt(record.ThunuwaMale) + parseInt(record.ThunuwaFemale)}</TableCell>

                                    <TableCell align='center'>{record.TotalArrestedInDateRange}</TableCell>
                                    <TableCell align='center'>{record.TotalReleasedInDateRange}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key='total' >
                                <TableCell className='bg-primary fw-bold' colSpan={2}>जम्मा</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaTotal}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.Nabalak) + parseInt(totals.Nabalika)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.KaidiTotal) + parseInt(totals.ThunuwaTotal) + parseInt(totals.Nabalak) + parseInt(totals.Nabalika)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.KaidiFemale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.KaidiMale) + parseInt(totals.KaidiFemale)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaMale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.ThunuwaFemale}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{parseInt(totals.ThunuwaMale) + parseInt(totals.ThunuwaFemale)}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.SumOfArrestedInDateRange}</TableCell>
                                <TableCell align='center' className='bg-success fw-bold'>{totals.SumOfReleasedInDateRange}</TableCell>
                            </TableRow>
                        </TableBody>
    </>
  )
}

export default CountTableBody