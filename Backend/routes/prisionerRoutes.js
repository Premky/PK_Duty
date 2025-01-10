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

const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-4-1'
// console.log(current_date);

router.post('/add_prisioner', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    // console.log('User ID:', userToken.uid);
    // console.log('Office ID:', userToken.office);

    // Destructuring the data from the request body
    const {
        address, arrested, case_id, country, dob, duration, faisala_date,
        faisala_office, fine, fine_duration, gender, jaherwala, karagar_date, name_en, name_np,
        office_id, prisioner_type, punarabedan, release_date, total_duration
    } = req.body;

    console.log("Check Data:", { office_id, case_id });

    // Input Validation: Ensure the office_id in the payload matches the user's token
    if (parseInt(office_id, 10) !== parseInt(userToken.office, 10)) {
        return res.status(403).json({
            Status: false,
            Error: 'Unauthorized: Invalid office ID.',
        });
    }

    // SQL query for inserting prisoner data
    const sql = `
        INSERT INTO prisioners_info (
            address, arrested, case_id, country, dob, duration, faisala_date,
            faisala_office, fine, fine_duration, gender, jaherwala, karagar_date, name_en, name_np,
            office_id, prisioner_type, punarabedan, release_date, total_duration, created_by, created_at
        ) VALUES (?)
    `;

    // Values for the query, including additional metadata
    const values = [
        address, arrested, case_id, country, dob, duration, faisala_date,
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

//Get Police Records
router.get('/get_release_prisioners', async (req, res) => {
    // console.log('Rank working');
    const sql = `SELECT pi.*, c.name_np AS case_np, c.name_en AS case_en 
                FROM prisioners_info pi
                LEFT JOIN cases c ON pi.case_id = c.id
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

router.get('/get_report', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    // console.log('mainoffice', userToken.main_office);
    // console.log('User ID:', userToken.uid);
    // console.log('Office ID:', userToken.office);
    // console.log(current_date)
    const sql = `SELECT 
                c.name_np AS CaseNameNP,
                c.name_en AS CaseNameEN,                    
                COUNT(*) AS Total,
                
                -- Kaidi Total, Male and Female
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'कैदी' THEN 1 ELSE 0 END) AS KaidiTotal,
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'कैदी' AND gender = 'M' THEN 1 ELSE 0 END) AS KaidiMale,
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'कैदी' AND gender = 'F' THEN 1 ELSE 0 END) AS KaidiFemale,
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'कैदी' AND TIMESTAMPDIFF(YEAR, pi.dob,  ${current_date}) > 65 THEN 1 ELSE 0 END) AS KaidiAgeAbove65,                
                
                -- Thunuwa Total, Male and Female
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'थुनुवा' THEN 1 ELSE 0 END) AS ThunuwaTotal,
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'थुनुवा' AND gender = 'M' THEN 1 ELSE 0 END) AS ThunuwaMale,
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'थुनुवा' AND gender = 'F' THEN 1 ELSE 0 END) AS ThunuwaFemale,
                SUM(CASE WHEN pi.release_id IS NULL AND prisioner_type = 'थुनुवा' AND TIMESTAMPDIFF(YEAR, pi.dob, ${current_date}) > 65 THEN 1 ELSE 0 END) AS ThunuwaAgeAbove65,

                -- Nabalik_Nabalika
                SUM(CASE WHEN pi.release_id IS NULL AND gender = 'M' AND TIMESTAMPDIFF(YEAR, pi.dob,  ${current_date}) < 18 THEN 1 ELSE 0 END) AS Nabalak,
                SUM(CASE WHEN pi.release_id IS NULL AND gender = 'F' AND TIMESTAMPDIFF(YEAR, pi.dob,  ${current_date}) < 18 THEN 1 ELSE 0 END) AS Nabalika
            FROM 
                prisioners_info pi
                LEFT JOIN cases c ON pi.case_id = c.id   
            WHERE 
                pi.office_id = ?                     
            GROUP BY 
                case_id;
            `;

    try {
        const result = await query(sql, userToken.main_office);

        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});


export { router as prisionerRouter }