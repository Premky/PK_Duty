import express from 'express';
import con from '../utils/db.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import NepaliDate from 'nepali-datetime';

import { getUsers, createUser } from '../controllers/userController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();
const query = promisify(con.query).bind(con);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import NepaliDateConverter from 'nepali-date-converter';
const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-04-01'
// console.log(current_date);

function converttoad(bsdate) {
    try {
        const dobAD = NepaliDateConverter.parse(bsdate);
        const ad = dobAD.getAD();
        // console.log('DOB_AD', ad);
        // Accessing year, month, and day using methods
        const year = ad.year;
        const month = ad.month + 1;
        const date = ad.date;
        const day = ad.day + 1;
        const formattedDobAD = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        // console.log('Formatted DOB_AD:', formattedDobAD);
        return formattedDobAD;
    }
    catch (err) {
        console.error(err);
    }
}
console.log(converttoad('2081-10-01'));

router.post('/add_prisioner', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    // console.log('User ID:', userToken.uid);
    // console.log('Office ID:', userToken.office);
    const main_office = userToken.main_office
    // Destructuring the data from the request body
    const {
        address, arrested, case_id, country, dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, karagar_date, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration
    } = req.body;


    console.log("Check Data:", { office_id, main_office });

    // Input Validation: Ensure the office_id in the payload matches the user's token
    if (parseInt(office_id, 10) !== parseInt(main_office, 10)) {
        return res.status(403).json({
            Status: false,
            Error: 'Unauthorized: Invalid office ID.',
        });
    }
    const ad_dob = converttoad(dob);
    // SQL query for inserting prisoner data
    const sql = `
        INSERT INTO prisioners_info (
            address, arrested, case_id, country, dob, dob_ad, duration, faisala_date,
            faisala_office, fine, fine_duration, gender, jaherwala, karagar_date, name_en, name_np,
            office_id, prisioner_type, punarabedan, release_date, total_duration, created_by, created_at
        ) VALUES (?)
    `;

    // Values for the query, including additional metadata
    const values = [
        address, arrested, case_id, country, dob, ad_dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, karagar_date, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration,
        userToken.uid, new Date() // Metadata: User ID and timestamp
    ];

    try {
        // Execute the query
        const result = await query(sql, [values]);

        // Respond with success
        return res.status(201).json({
            Status: true,
            Message: 'Prisoner data added successfully.',
            Result: result,
        });
    } catch (err) {
        console.error('Database Error:', err);

        // Respond with a generic internal server error
        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
});

//Get Individual Records
router.get('/get_prisioners/:id', async (req, res) => {
    const id = req.params.id;
    const userToken = req.user; // Details from token, 
    // console.log(user_token);
    // console.log('uid', user_token.uid);
    // console.log('office', user_token.office);
    // console.log('Rank working');
    const sql = `SELECT pi.*, c.name_np AS case_np, c.name_en AS case_en 
                FROM prisioners_info pi
                LEFT JOIN cases c ON pi.case_id = c.id
                WHERE pi.id =?
                `;

    try {
        const result = await query(sql, id);
        // console.log(result)
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

//Get Police Records
router.get('/get_prisioners', async (req, res) => {
    // console.log('Rank working');
    const sql = `SELECT pi.*, c.name_np AS case_np, c.name_en AS case_en 
                FROM prisioners_info pi
                LEFT JOIN cases c ON pi.case_id = c.id
                WHERE pi.office_id=1 AND pi.release_id IS NULL
                ORDER BY pi.name_np ASC`;

    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.put('/update_prisioner/:id', verifyToken, async (req, res) => {
    const userToken = req.user; // Details from token, 
    // console.log(user_token);
    // console.log('uid', user_token.uid);
    // console.log('office', user_token.office);

    const id = req.params.id;
    const { address, arrested, case_id, country, dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration } = req.body;
    console.log("Check Data:", id);
    const ad_dob = converttoad(dob);

    //Input Validation
    if (parseInt(office_id, 10) !== parseInt(userToken.main_office, 10)) {
        return res.status(403).json({
            Status: false,
            Error: 'Unauthorized: Invalid office ID.',
        });
    }

    const sql = `UPDATE prisioners_info 
                SET
                address=?, arrested=?, case_id=?, country=?, dob=?, dob_ad=?, duration=?, faisala_date=?,
                faisala_office=?, fine=?, fine_duration=?, gender=?, jaherwala=?, name_en=?, name_np=?,
                office_id=?, prisioner_type=?, punarabedan=?, release_date=?, total_duration=?,
                updated_by=?, updated_at=? WHERE id=?`;
    const values = [address, arrested, case_id, country, dob, ad_dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration,
        userToken.uid, new Date(), id
    ];
    console.log(values);

    try {
        const result = await query(sql, values);
        return res.status(201).json({
            Status: true,
            Message: 'Data updated successfully.',
            Result: result,
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
})

//Delete Police 
router.delete('/delete_police/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the ID to ensure it's a valid format (e.g., an integer)
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ Status: false, Error: 'Invalid ID format' });
    }

    try {
        const sql = "DELETE FROM sec_employe WHERE id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Database query error:', err); // Log the error for internal debugging
                return res.status(500).json({ Status: false, Error: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ Status: false, Error: 'Record not found' });
            }

            return res.status(200).json({ Status: true, Result: result });
        });
    } catch (error) {
        console.error('Unexpected error:', error); // Log unexpected errors for internal debugging
        return res.status(500).json({ Status: false, Error: 'Unexpected error occurred' });
    }
});

router.post('/add_release_prisioner', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token

    const {
        office_id, prisioner_name, reason, nirnay_miti, karyanayan_miti, nirnay_officer, aafanta_name,
        aafanta_address, aafanta_contact, aafanta_photo
    } = req.body;

    console.log("Check Data:", { office_id, reason });

    // Input Validation
    if (parseInt(office_id, 10) !== parseInt(userToken.main_office, 10)) {
        return res.status(403).json({
            Status: false,
            Error: 'Unauthorized: Invalid office ID.',
        });
    }

    try {
        // Start a transaction
        await query('START TRANSACTION');

        // Insert query for prisoner release details
        const insertReleaseSql = `
            INSERT INTO prisioners_release_details (
                office_id, prisioners_id, reason, nirnay_miti, karyanayan_miti, nirnay_officer, aafanta_name,
                aafanta_address, aafanta_contact, aafanta_photo, created_by, created_at
            ) VALUES (?)
        `;

        const releaseValues = [
            office_id, prisioner_name, reason, nirnay_miti, karyanayan_miti, nirnay_officer, aafanta_name,
            aafanta_address, aafanta_contact, aafanta_photo, userToken.uid, new Date()
        ];

        const releaseResult = await query(insertReleaseSql, [releaseValues]);
        const releaseId = releaseResult.insertId;

        // Update query for `prisioners_info`
        const updatePrisonerSql = `
            UPDATE prisioners_info
            SET release_id = ?, released_date=?
            WHERE id = ?
        `;

        const updatePrisonerResult = await query(updatePrisonerSql, [releaseId, karyanayan_miti, prisioner_name]);

        // Commit the transaction
        await query('COMMIT');

        return res.status(201).json({
            Status: true,
            Message: 'Prisoner data added and release ID updated successfully.',
            ReleaseResult: releaseResult,
            UpdateResult: updatePrisonerResult,
        });
    } catch (err) {
        // Rollback the transaction
        await query('ROLLBACK');
        console.error('Transaction Error:', err);

        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
});




//Get Individual Records
router.get('/get_release_prisioners/:id', async (req, res) => {
    const id = req.params.id;
    const userToken = req.user; // Details from token, 
    // console.log(user_token);
    // console.log('uid', user_token.uid);
    // console.log('office', user_token.office);
    // console.log('Rank working');
    const sql = `SELECT pi.*, c.name_np AS case_np, c.name_en AS case_en 
                FROM prisioners_info pi
                LEFT JOIN cases c ON pi.case_id = c.id
                WHERE pi.id =?
                `;

    try {
        const result = await query(sql, id);
        // console.log(result)
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

//Get Released Records
router.get('/get_released_prisioners', async (req, res) => {
    const userToken = req.user;
    // console.log(userToken);
    const sql = `SELECT pi.*, c.name_np AS case_np, prr.reasons_np AS reason_np
                FROM prisioners_release_details prd
                LEFT JOIN prisioners_info pi ON prd.prisioners_id = pi.id
                LEFT JOIN cases c ON pi.case_id = c.id
                LEFT JOIN prisioners_release_reasons prr ON prd.reason = prr.id
                WHERE pi.release_id IS NOT NULL
                ORDER BY pi.name_np ASC`;

    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.put('/update_release_prisioner/:id', verifyToken, async (req, res) => {
    const userToken = req.user; // Details from token, 
    // console.log(user_token);
    // console.log('uid', user_token.uid);
    // console.log('office', user_token.office);

    const id = req.params.id;

    const { address, arrested, case_id, country, dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration } = req.body;
    console.log("Check Data:", id);

    //Input Validation
    if (parseInt(office_id, 10) !== parseInt(userToken.office, 10)) {
        return res.status(403).json({
            Status: false,
            Error: 'Unauthorized: Invalid office ID.',
        });
    }

    const sql = `UPDATE prisioners_info 
                SET
                address=?, arrested=?, case_id=?, country=?, dob=?, duration=?, faisala_date=?,
                faisala_office=?, fine=?, fine_duration=?, gender=?, jaherwala=?, name_en=?, name_np=?,
                office_id=?, prisioner_type=?, punarabedan=?, release_date=?, total_duration=?,
                updated_by=?, updated_at=? WHERE id=?`;
    const values = [address, arrested, case_id, country, dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration,
        userToken.uid, new Date(), id
    ];
    console.log(values);

    try {
        const result = await query(sql, values);
        return res.status(201).json({
            Status: true,
            Message: 'Data updated successfully.',
            Result: result,
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
})

//Aashrit Operation Started
router.get('/get_aashrit_prisioners', async (req, res) => {
    // console.log('Rank working');
    const sql = `SELECT pi.*, c.name_np AS case_np, c.name_en AS case_en 
                FROM prisioners_info pi
                LEFT JOIN cases c ON pi.case_id = c.id
                WHERE prisioner_type='आश्रित'
                ORDER BY pi.name_np ASC`;

    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.post('/add_aashrit', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    // console.log('User ID:', userToken.uid);
    // console.log('Office ID:', userToken.office);
    const main_office = userToken.main_office
    // Destructuring the data from the request body
    const {
        dob, gender, guardian, name_en, name_np, office_id
    } = req.body;

    console.log("Check Data:", { office_id, main_office });

    // Input Validation: Ensure the office_id in the payload matches the user's token
    if (parseInt(office_id, 10) !== parseInt(main_office, 10)) {
        return res.status(403).json({
            Status: false,
            Error: 'Unauthorized: Invalid office ID.',
        });
    }

    // SQL query for inserting prisoner data
    const sql = `
        INSERT INTO prisioners_aashrit (
            dob, gender, prisioner_id,  aashrit_name, office_id, created_by, created_at
        ) VALUES (?)
    `;

    // Values for the query, including additional metadata
    const values = [
        dob, gender, guardian.id, name_np, office_id,
        userToken.uid, new Date() // Metadata: User ID and timestamp
    ];

    try {
        // Execute the query
        const result = await query(sql, [values]);

        // Respond with success
        return res.status(201).json({
            Status: true,
            Message: 'आश्रीतको विवरण थपियो ।',
            Result: result,
        });
    } catch (err) {
        console.error('Database Error:', err);

        // Respond with a generic internal server error
        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
});

router.get('/get_released_counts', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    const endDate = req.query.endDate;
    const curr_year = new NepaliDate().format('YYYY');
    const curr_month = new NepaliDate().format('MM');
    const prev_month = (new NepaliDate().format('MM') - 1).toString().padStart(2, '0');
    const curr_day = new NepaliDate().format('DD');

    // Ensure curr_month and prev_month are always in 'MM' format
    const formatted_curr_month = curr_month.padStart(2, '0');
    const formatted_prev_month = prev_month.padStart(2, '0');
    const formatted_curr_day = curr_day.padStart(2, '0');

    const prev_month_date = `${curr_year}-${formatted_prev_month}-01`;
    const this_month = `${curr_year}-${formatted_curr_month}-01`

    // const prev_month_date = curr_year + '-' + prev_month + '-' + curr_day;
    // const this_month = curr_year + '-' + curr_month + '-' + 1;
    

    // console.log(prev_month_date, this_month)
    // console.log('mainoffice', userToken.main_office);    
    const sql = `SELECT 
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=1 THEN 1 ELSE 0 END) AS TotalRegYear,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=1 THEN 1 ELSE 0 END) AS TotalRegMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND pi.gender='M' AND (prd.reason=1 OR prd.reason=2) THEN 1 ELSE 0 END) AS TotalRegMaleMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND pi.gender='F' AND (prd.reason=1 OR prd.reason=2) THEN 1 ELSE 0 END) AS TotalRegFemaleMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=2 THEN 1 ELSE 0 END) AS TotalDharautiYear,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=2 THEN 1 ELSE 0 END) AS TotalDharautiMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=3 THEN 1 ELSE 0 END) AS TotalParoleYear,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=3 THEN 1 ELSE 0 END) AS TotalParoleMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=4 THEN 1 ELSE 0 END) AS TotalMafiYear,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=4 THEN 1 ELSE 0 END) AS TotalMafiMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=5 THEN 1 ELSE 0 END) AS TotalWorkYear,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=5 THEN 1 ELSE 0 END) AS TotalWorkMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=6 THEN 1 ELSE 0 END) AS Total155Year,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=6 THEN 1 ELSE 0 END) AS Total155Month,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${fy_date}' AND prd.reason=7 THEN 1 ELSE 0 END) AS TotalTransferYear,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND prd.reason=7 THEN 1 ELSE 0 END) AS TotalTransferMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND pi.gender='M' AND prd.reason=7 THEN 1 ELSE 0 END) AS TotalTransferMaleMonth,
        SUM(CASE WHEN pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND pi.gender='F' AND prd.reason=7 THEN 1 ELSE 0 END) AS TotalTransferFemaleMonth,
        SUM(CASE WHEN (pi.release_id IS NULL AND pi.gender='M') OR (pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND pi.gender='M') THEN 1 ELSE 0 END) AS TotalPrevMaleMonth,
        SUM(CASE WHEN (pi.release_id IS NULL AND pi.gender='F') OR (pi.release_id IS NOT NULL AND pi.released_date>='${this_month}' AND pi.gender='F') THEN 1 ELSE 0 END) AS TotalPrevFemaleMonth,
        
        COUNT(*) AS Total
        FROM prisioners_info pi
        LEFT JOIN prisioners_release_details prd ON pi.release_id = prd.id
        WHERE pi.office_id=${userToken.main_office}
        `;
    // console.log(sql);
    try {
        // Execute the query
        const result = await query(sql);

        // Respond with success
        return res.status(201).json({
            Status: true,
            Message: 'आश्रीतको विवरण थपियो ।',
            Result: result,

        });
    } catch (err) {
        console.error('Database Error:', err);

        // Respond with a generic internal server error
        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
});

router.get('/get_nepali_prisioners_report', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    const { startDate, endDate } = req.query;
    // console.log(req.query);
    // console.log('mainoffice', userToken.main_office);    
    const sql = `SELECT 
    c.name_np AS CaseNameNP,
    c.name_en AS CaseNameEN,
    COUNT(*) AS Total,

    -- Kaidi Total, Male, Female, and Age Above 65
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' THEN 1 ELSE 0 END) AS KaidiTotal,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND pi.gender = 'M' THEN 1 ELSE 0 END) AS KaidiMale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND pi.gender = 'F' THEN 1 ELSE 0 END) AS KaidiFemale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) > 65 THEN 1 ELSE 0 END) AS KaidiAgeAbove65,

    -- Thunuwa Total, Male, Female, and Age Above 65
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' THEN 1 ELSE 0 END) AS ThunuwaTotal,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND pi.gender = 'M' THEN 1 ELSE 0 END) AS ThunuwaMale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND pi.gender = 'F' THEN 1 ELSE 0 END) AS ThunuwaFemale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) > 65 THEN 1 ELSE 0 END) AS ThunuwaAgeAbove65,

    -- Nabalak and Nabalika
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) < 18 THEN 1 ELSE 0 END) AS KaidiNabalak,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) < 18 THEN 1 ELSE 0 END) AS ThunuwaNabalak,
    SUM(CASE WHEN release_id IS NULL AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) < 18 THEN 1 ELSE 0 END) AS TotalNabalak,
    
    -- SUM(CASE WHEN release_id IS NULL AND pa.gender = 'F' THEN 1 ELSE 0 END) AS Nabalika,
    -- Maashrit and Faashrit
    SUM(CASE WHEN release_id IS NULL AND pa.gender = 'M' THEN 1 ELSE 0 END) AS Maashrit,
    SUM(CASE WHEN release_id IS NULL AND pa.gender = 'F' THEN 1 ELSE 0 END) AS Faashrit,

    -- Total within date range
    SUM(CASE WHEN pi.karagar_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS TotalArrestedInDateRange,
    SUM(CASE WHEN release_id IS NULL AND pi.karagar_date BETWEEN ? AND ? AND pi.gender = 'M' THEN 1 ELSE 0 END) AS TotalMaleArrestedInDateRange,
    SUM(CASE WHEN release_id IS NULL AND pi.karagar_date BETWEEN ? AND ? AND pi.gender = 'F' THEN 1 ELSE 0 END) AS TotalFemaleArrestedInDateRange,

    SUM(CASE WHEN pi.released_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS TotalReleasedInDateRange,
    SUM(CASE WHEN pi.released_date BETWEEN ? AND ? AND pi.gender = 'M' THEN 1 ELSE 0 END) AS TotalMaleReleasedInDateRange,
    SUM(CASE WHEN pi.released_date BETWEEN ? AND ? AND pi.gender = 'F' THEN 1 ELSE 0 END) AS TotalFemaleReleasedInDateRange
FROM 
    prisioners_info pi
LEFT JOIN cases c ON pi.case_id = c.id
LEFT JOIN prisioners_aashrit pa ON pi.id = pa.prisioner_id   
LEFT JOIN np_country npc ON pi.country = npc.id
WHERE
    pi.office_id = ? AND pi.karagar_date <= '${endDate}' AND (npc.name_np='नेपाल' OR pi.country=154)
GROUP BY 
    pi.case_id, c.name_np, c.name_en
HAVING 
    KaidiTotal > 0 OR 
    ThunuwaTotal > 0 OR 
    TotalArrestedInDateRange > 0 OR 
    TotalReleasedInDateRange > 0
ORDER BY 
    c.name_np;
    `;


    try {
        const params = [
            startDate, endDate, //Total Arrested
            startDate, endDate, //Male Arrested
            startDate, endDate, //Female Arrested
            startDate, endDate, //Total Released
            startDate, endDate, //Male Released
            startDate, endDate, //Female Released
            userToken.main_office,
            startDate, endDate
        ]
        const result = await query(sql, params);
        // console.log(result)

        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.get('/get_foreign_prisioners_report', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    const { startDate, endDate } = req.query;
    // console.log(req.query);
    // console.log('mainoffice', userToken.main_office);    
    const sql = `SELECT 
    c.name_np AS CaseNameNP,
    c.name_en AS CaseNameEN,
    npc.name_np AS CountryName,
    COUNT(*) AS Total,

    -- Kaidi Total, Male, Female, and Age Above 65
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' THEN 1 ELSE 0 END) AS KaidiTotal,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND pi.gender = 'M' THEN 1 ELSE 0 END) AS KaidiMale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND pi.gender = 'F' THEN 1 ELSE 0 END) AS KaidiFemale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) > 65 THEN 1 ELSE 0 END) AS KaidiAgeAbove65,

    -- Thunuwa Total, Male, Female, and Age Above 65
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' THEN 1 ELSE 0 END) AS ThunuwaTotal,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND pi.gender = 'M' THEN 1 ELSE 0 END) AS ThunuwaMale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND pi.gender = 'F' THEN 1 ELSE 0 END) AS ThunuwaFemale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) > 65 THEN 1 ELSE 0 END) AS ThunuwaAgeAbove65,

    -- Nabalak and Nabalika
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) < 18 THEN 1 ELSE 0 END) AS KaidiNabalak,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) < 18 THEN 1 ELSE 0 END) AS ThunuwaNabalak,
    SUM(CASE WHEN release_id IS NULL AND TIMESTAMPDIFF(YEAR, pi.dob_ad, CURDATE()) < 18 THEN 1 ELSE 0 END) AS TotalNabalak,
    
    -- SUM(CASE WHEN release_id IS NULL AND pa.gender = 'F' THEN 1 ELSE 0 END) AS Nabalika,
    -- Maashrit and Faashrit
    SUM(CASE WHEN release_id IS NULL AND pa.gender = 'M' THEN 1 ELSE 0 END) AS Maashrit,
    SUM(CASE WHEN release_id IS NULL AND pa.gender = 'F' THEN 1 ELSE 0 END) AS Faashrit,

    -- Total within date range
    SUM(CASE WHEN pi.karagar_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS TotalArrestedInDateRange,
    SUM(CASE WHEN pi.karagar_date BETWEEN ? AND ? AND pi.gender='M' THEN 1 ELSE 0 END) AS TotalMaleArrestedInDateRange,
    SUM(CASE WHEN pi.karagar_date BETWEEN ? AND ? AND pi.gender = 'F' THEN 1 ELSE 0 END) AS TotalFemaleArrestedInDateRange,

    SUM(CASE WHEN pi.released_date BETWEEN ? AND ? THEN 1 ELSE 0 END) AS TotalReleasedInDateRange,
    SUM(CASE WHEN pi.released_date BETWEEN ? AND ? AND pi.gender = 'M' THEN 1 ELSE 0 END) AS TotalMaleReleasedInDateRange,
    SUM(CASE WHEN pi.released_date BETWEEN ? AND ? AND pi.gender = 'F' THEN 1 ELSE 0 END) AS TotalFemaleReleasedInDateRange
FROM 
    prisioners_info pi
LEFT JOIN cases c ON pi.case_id = c.id
LEFT JOIN prisioners_aashrit pa ON pi.id = pa.prisioner_id   
LEFT JOIN np_country npc ON pi.country = npc.id
WHERE
    pi.office_id = ? AND pi.karagar_date <= '${endDate}' AND (npc.name_np!='नेपाल' OR pi.country!=154)
GROUP BY 
    pi.case_id, c.name_np, c.name_en, npc.name_np
HAVING 
    KaidiTotal > 0 OR 
    ThunuwaTotal > 0 OR 
    TotalArrestedInDateRange > 0 OR 
    TotalReleasedInDateRange > 0
ORDER BY 
    c.name_np;
    `;


    try {
        const params = [
            startDate, endDate, //Total Arrested
            startDate, endDate, //Male Arrested
            startDate, endDate, //Female Arrested
            startDate, endDate, //Total Released
            startDate, endDate, //Male Released
            startDate, endDate, //Female Released
            userToken.main_office,
            startDate, endDate
        ]
        const result = await query(sql, params);
        // console.log(result)

        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});
export { router as prisionerRouter }