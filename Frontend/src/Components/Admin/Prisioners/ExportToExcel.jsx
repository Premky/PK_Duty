import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportToExcel = async (records, totals, fy, fm) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prisoner Records");

    // Page Setup
    worksheet.pageSetup = {
        paperSize: 9, // A4 size (9), Letter (1)
        orientation: 'landscape', // 'portrait' or 'landscape'
        margins: {
            left: 0.75, right: 0.5, top: 0.75, bottom: 0.75,
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
    ['श्री कारागार व्यवस्थापन विभाग'],
    ['कालिकास्थान, काठमाडौं'],
    ['विषयः मास्केवारी विवरण पठाइएको बारे ।'],
    ['यस कार्यालयको ${fy} सालको ${fm} महिनाको मास्केबारी निम्नानुसार पठाइएको व्यहोरा सादर अनुरोध छ ।'],
    ['तपसिल' ],
    ['चालु आर्थिक वर्षमा छुटेका कैदीबन्दीको संख्या'],
    [
        'अदालतको आदेश वा नियमित छुट संख्या', '', '','',
        'कामदारी सुविधा पाएका कुल संख्या', '', '','',
        'माफिमिनाहा पाएका छुट संख्या', '', '','',
        'मुलुकी फौजदारी कार्यविधि संहिता २०७४ को दफा १५५', '', '',''
    ],
    [   
        'हालसम्मको','', 'यो महिनाको','',                    
        'हालसम्मको','', 'यो महिनाको','',                    
        'हालसम्मको','', 'यो महिनाको','',                    
        'हालसम्मको','', 'यो महिनाको','',                                
    ],
    [   
        'हालसम्मको','', 'यो महिनाको','',                    
        'हालसम्मको','', 'यो महिनाको','',                    
        'हालसम्मको','', 'यो महिनाको','',                    
        'हालसम्मको','', 'यो महिनाको','',                                
    ],
    [   `${fy} सालको ${fm} महिनाको मसान्त सम्मको कैदीबन्दी संख्या`, ],
    [   'सि.नं.', 'विवरण','','','','','','','','', 'पुरुष',  'महिला', 'जम्मा', 'कैफियत','',''   ],
    [   '१', 'अघिल्लो महिनाको संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '२', 'यस महिनाको थप संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '३', 'यस महिनामा छुटेको संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '४', 'यस महिनामा सरुवा भएको संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '५', 'यस महिनामा मृत्यु भएको संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '६', 'यस महिनामा कायम रहेको कैदीबन्दी संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '७', 'हालको आश्रित बालबालिकाको संख्या','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   '', 'जम्मा','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   'मुद्दा अनुसारको स्वदेशी कैदीबन्दीहरुको संख्या', '','','','','','','','','', '0',  '0', '0', 'कै','',''  ],
    [   'सि.नं.','मुद्दाको विवरण','जम्मा','','पुरुष','','महिला','','नाबालक/नाबालिका','६५ वर्ष माथिका', '',  'कैफियत', '' ],
    [   '','','कैदी','थुनुवा','कैदी','थुनुवा','कैदी','थुनुवा','कैदी','थुनुवा', 'कैदी', 'थुनुवा', '0', 'कै',''  ],
];


    // Adding headers
    headers.forEach((headerRow, index) => {
        const row = worksheet.addRow(headerRow);
        row.font = { name: "Kalimati", bold: true, size: 12 };
        row.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        
        // worksheet.mergeCells(`A${index + 1}:P${index + 1}`);
    });

    // Merge specific column headers (for grouped headers)
    worksheet.mergeCells('A1:P1'); // कार्यालयको नाम
    worksheet.mergeCells('A2:P2'); // कार्यालयको ठेगाना
    worksheet.mergeCells('A3:P3'); // विषय
    worksheet.mergeCells('A4:P4'); // विवरण२
    worksheet.mergeCells('A5:P5'); // तपसिल
    worksheet.mergeCells('A6:P6'); // विवरण२
    worksheet.mergeCells('A7:D7'); // अदालतको आदेश वा नियमित छुट संख्या
    worksheet.mergeCells('E7:H7'); // कामदारी सुविधा पाएका कुल संख्या
    worksheet.mergeCells('I7:L7'); // माफिमिनाहा पाएका छुट संख्या
    worksheet.mergeCells('M7:P7'); // मुलुकी फौजदारी कार्यविधि संहिता २०७४ को दफा १५५
    worksheet.mergeCells('A8:B8'); // हाल सम्मको
    worksheet.mergeCells('A9:B9'); // हाल सम्मको
    worksheet.mergeCells('C8:C8'); // यो महिनाको
    
    worksheet.mergeCells('C9:C9'); // यो महिनाको
    worksheet.mergeCells('E8:F8'); // हाल सम्मको
    
    worksheet.mergeCells('E9:F9'); // हाल सम्मको
    worksheet.mergeCells('G8:H8'); // यो महिनाको
    
    worksheet.mergeCells('G9:H9'); // यो महिनाको
    
    worksheet.mergeCells('I8:J8'); // हाल सम्मको
    worksheet.mergeCells('I9:J9'); // हाल सम्मको
    worksheet.mergeCells('K8:L8'); // यो महिनाको
    
    worksheet.mergeCells('K9:L9'); // यो महिनाको
    
    worksheet.mergeCells('M8:N8'); // हाल सम्मको
    worksheet.mergeCells('M9:N9'); // हाल सम्मको
    worksheet.mergeCells('O8:P8'); // यो महिनाको
    
    worksheet.mergeCells('O9:P9'); // यो महिनाको
    
    
    
    worksheet.mergeCells('A10:P10'); // यो महिनाको

    // Adding data rows
    records.forEach((record, index) => {
        worksheet.addRow([
            index + 1,
            record.CaseNameNP, "", "",
            record.KaidiTotal, record.ThunuwaTotal,
            record.KaidiMale, record.ThunuwaMale,
            record.KaidiFemale, record.ThunuwaFemale,
            parseInt(record.Nabalak) + parseInt(record.Nabalika),
            record.Remarks
        ]);
    });

    // Totals row
    worksheet.addRow([
        "", "जम्मा", "", "",
        totals.KaidiTotal, totals.ThunuwaTotal,
        totals.KaidiMale, totals.ThunuwaMale,
        totals.KaidiFemale, totals.ThunuwaFemale,
        totals.Nabalak + totals.Nabalika, ""
    ]);

    // Borders
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });
    });

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Maskebari_Report_${fy}_${fm}.xlsx`);
};

const MaskebariExport = ({ records, totals, fy, fm }) => {
    return (
        <button onClick={() => exportToExcel(records, totals, fy, fm)} className="btn btn-primary">
            Export to Excel
        </button>
    );
};

export { MaskebariExport, exportToExcel };
