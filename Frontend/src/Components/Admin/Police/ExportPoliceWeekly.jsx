import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const exportToExcel = async (start_Date, end_Date, records, totals, fy, fm, formattedDateNp, policeCommander) => {
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Prisoner Records');

        // Set page layout
        worksheet.pageSetup = {
            paperSize: 9, // A4 size (9), Letter (1)
            orientation: 'landscape', // 'portrait' or 'landscape'
            margins: {
                left: 0.5, right: 0.5, top: 0.75, bottom: 0.75,
                header: 0.3, footer: 0.3
            },
            fitToPage: true, // Scale to fit on one page
            fitToWidth: 1, // Fit to 1 page wide
            fitToHeight: 1, // Fit to 1 page tall
            horizontalCentered: true, // Center content horizontally
            verticalCentered: false, // Center content vertically
        };

        // Headers for the Excel sheet
        const headers = [
            [`मिति ${start_Date} गतेबाट ${end_Date} सम्म कारागार कार्यालय संखुवासभामा रहेका कैदीबन्दीहरुको मुद्दागत जाहेरी`],
            ['सि.नं.', 'मुद्दा',
                'जम्मा', '', '', '',
                'कैदी', '', '',
                'थुनुवा', '', '',
                'आएको संख्या', 'छुटेको संख्या', 'कैफियत'],
            ['', '',
                'कैदी', 'थुनुवा', 'आश्रीत', 'जम्मा',
                'पुरुष', 'महिला', 'जम्मा',
                'पुरुष', 'महिला', 'जम्मा',
                '', '', '']
        ];

        // Add headers to the worksheet
        headers.forEach((headerRow, index) => {
            const row = worksheet.addRow(headerRow);
            if (index === 0) {
                row.font = { bold: true, size: 12 };
                row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
            row.font = { name: 'Kalimati', bold: true, size: 11 };
            row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });

        // Add data rows
        records.forEach((record, index) => {
            worksheet.addRow([
                index + 1,
                record.CaseNameNP,
                record.KaidiTotal,
                record.ThunuwaTotal,
                parseInt(record.Nabalak) + parseInt(record.Nabalika),
                parseInt(record.KaidiTotal) + parseInt(record.ThunuwaTotal),
                record.KaidiMale,
                record.KaidiFemale,
                parseInt(record.KaidiMale) + parseInt(record.KaidiFemale),
                record.ThunuwaMale,
                record.ThunuwaFemale,
                parseInt(record.ThunuwaMale) + parseInt(record.ThunuwaFemale),
                record.TotalArrestedInDateRange,
                record.TotalReleasedInDateRange,
                record.Remarks||''
            ]);
        });


        // Add totals row
        const totalRow = worksheet.addRow([
            '',
            'जम्मा',
            totals.KaidiTotal,
            totals.ThunuwaTotal,
            totals.Nabalak + totals.Nabalika,
            totals.KaidiTotal + totals.ThunuwaTotal + totals.Nabalak + totals.Nabalika,
            totals.KaidiMale,
            totals.KaidiFemale,
            totals.KaidiMale + totals.KaidiFemale,
            totals.ThunuwaMale,
            totals.ThunuwaFemale,
            totals.ThunuwaMale + totals.ThunuwaFemale,
            totals.SumOfArrestedInDateRange,
            totals.SumOfReleasedInDateRange,
            ''
        ]);


        // Add borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            // Skip the first three header rows to avoid overwriting their font
            if (rowNumber > 3) {
                row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                row.font = { name: 'Kalimati' };
            }
        });

        totalRow.font = { bold: true, name: 'Kalimati' };

        // Add additional rows
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '']);
        worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '']);
        const commanderRow = worksheet.addRow(['', `मितिः ${formattedDateNp} गते।`, '', '', '', '', '', '', '', '', '', `${policeCommander.length > 0 ? `${policeCommander[0].ranknp} ${policeCommander[0].name_np}` : "Loading..."}`]);
        const commanderRank = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '', 'का.सु. गार्ड प्रमुख']);

        // Merge cells for the police commander name
        const commanderRowIndex = commanderRow.number; // Get the row number
        worksheet.mergeCells(`L${commanderRowIndex}:N${commanderRowIndex}`);
        const commanderRankIndex = commanderRank.number; // Get the row number
        worksheet.mergeCells(`L${commanderRankIndex}:N${commanderRankIndex}`);


        // Merge cells
        worksheet.mergeCells('A1:O1'); // Title
        worksheet.mergeCells('A2:A3'); // सि.नं.
        worksheet.mergeCells('B2:B3'); // मुद्दा
        worksheet.mergeCells('C2:F2'); // जम्मा
        worksheet.mergeCells('G2:I2'); // कैदी
        worksheet.mergeCells('J2:L2'); // थुनुवा
        worksheet.mergeCells('M2:M3'); // आएको संख्या
        worksheet.mergeCells('N2:N3'); // छुटेको संख्या
        worksheet.mergeCells('O2:O3'); // कैफियत

        // Adjust column widths
        worksheet.columns.forEach((column, index) => {
            // column.width = index === 1 ? 30 : 10;  For specific column width 
            column.width = 10; //For all column width
        });
        worksheet.getColumn(2).width = 30; // For specific column width
        worksheet.getColumn(2).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        // Save the file
        // const buffer = await workbook.xlsx.writeBuffer();
        // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = 'prisoner_records.xlsx';
        // link.click();
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Weekly_Report_${start_Date}_${end_Date}.xlsx`);
    };
    const ExportPoliceWeekly = ({ start_Date, end_Date, records, totals, fy, fm, formattedDateNp, policeCommander}) => {
        return (
            <button onClick={() => exportToExcel(start_Date, end_Date, records, totals, fy, fm, formattedDateNp, policeCommander)} className="btn btn-primary">
                Export to Excel
            </button>
        );
    };
    
    export { ExportPoliceWeekly, exportToExcel };