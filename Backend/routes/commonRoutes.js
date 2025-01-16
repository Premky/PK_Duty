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
// console.log(fy_date);

router.post('/add_case', verifyToken, async (req, res) => {
    const user_token = req.user; // Details from token, 
    console.log('uid', user_token.uid);
    console.log('office', user_token.office);

    const { name_np, name_en, } = req.body;
    console.log("Check Data:", name_np, name_en);

    //Input Validation
    if (!name_np || !name_en) {
        return res.status(400).json({
            Status: false,
            Error: 'Invalid input, All fields are required.',
        });
    }
    const sql = `INSERT INTO cases(name_np, name_en) VALUES (?)`;

    const values = [name_np, name_en];
    // console.log(values);

    try {
        const result = await query(sql, [values]);
        return res.status(201).json({
            Status: true,
            Message: 'Data added successfully.',
            Result: result,
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({
            Status: false,
            Error: 'Internal Server Error. Please try again later.',
        });
    }
});

router.get('/get_cases', async (req, res) => {
    // console.log('Case working');
    const sql = `SELECT * FROM cases ORDER BY id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.put('/update_case/:id', verifyToken, async (req, res) => {
    const user_token = req.user; // Details from token, 
    // console.log('uid', user_token.uid);
    // console.log('office', user_token.office);

    const id = req.params.id;

    const { name_np, name_en } = req.body;
    console.log("Check Data:", id);

    //Input Validation
    if (!id || !name_np || !name_en) {
        return res.status(400).json({
            Status: false,
            Error: 'Invalid input, All fields are required.',
        });
    }

    const sql = `UPDATE cases SET
                name_np=?, name_en=? WHERE id=?`
    const values = [name_np, name_en, id];
    // console.log(values);

    try {
        const result = await query(sql, values);
        return res.status(201).json({
            Status: true,
            Message: 'Data added successfully.',
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
router.delete('/delete_case/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the ID to ensure it's a valid format (e.g., an integer)
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ Status: false, Error: 'Invalid ID format' });
    }

    try {
        const sql = "DELETE FROM cases WHERE id = ?";
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

router.get('/get_countries', async (req, res) => {
    // console.log('Case working');
    const sql = `SELECT * FROM np_country ORDER BY name_np`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.get('/get_juidicialbody', async (req, res) => {
    // console.log('Case working');
    const sql = `SELECT * FROM judicial_bodies ORDER BY id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.get('/get_admin_office', async (req, res) => {
    // console.log('Case working');

    const sql = `SELECT * FROM office WHERE is_police=? ORDER BY id`;
    try {
        const result = await query(sql, false);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.get('/get_blood_group', async (req, res) => {
    // console.log('Case working');

    const sql = `SELECT * FROM blood_group ORDER BY id`;
    try {
        const result = await query(sql, false);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.get('/get_prisioners_report', verifyToken, async (req, res) => {
    const userToken = req.user; // Extract details from the token
    const { startDate, endDate } = req.query;
    // console.log(req.query)
    // console.log('mainoffice', userToken.main_office);    
    const sql = `SELECT 
    c.name_np AS CaseNameNP,
    c.name_en AS CaseNameEN,                    
    COUNT(*) AS Total,

    -- Kaidi Total, Male and Female
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' THEN 1 ELSE 0 END) AS KaidiTotal,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND gender = 'M' THEN 1 ELSE 0 END) AS KaidiMale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND gender = 'F' THEN 1 ELSE 0 END) AS KaidiFemale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'कैदी' AND TIMESTAMPDIFF(YEAR, pi.dob, CURDATE()) > 65 THEN 1 ELSE 0 END) AS KaidiAgeAbove65,                

    -- Thunuwa Total, Male and Female
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' THEN 1 ELSE 0 END) AS ThunuwaTotal,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND gender = 'M' THEN 1 ELSE 0 END) AS ThunuwaMale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND gender = 'F' THEN 1 ELSE 0 END) AS ThunuwaFemale,
    SUM(CASE WHEN release_id IS NULL AND prisioner_type = 'थुनुवा' AND TIMESTAMPDIFF(YEAR, pi.dob, CURDATE()) > 65 THEN 1 ELSE 0 END) AS ThunuwaAgeAbove65,

    -- Nabalik_Nabalika
    SUM(CASE WHEN release_id IS NULL AND gender = 'M' AND TIMESTAMPDIFF(YEAR, pi.dob, CURDATE()) < 18 THEN 1 ELSE 0 END) AS Nabalak,
    SUM(CASE WHEN release_id IS NULL AND gender = 'F' AND TIMESTAMPDIFF(YEAR, pi.dob, CURDATE()) < 18 THEN 1 ELSE 0 END) AS Nabalika,

    -- Total within date range (filtered)
    SUM(CASE WHEN release_id IS NULL AND (STR_TO_DATE(pi.karagar_date, '%Y-%m-%d') BETWEEN ? AND ?) THEN 1 ELSE 0 END) AS TotalArrestedInDateRange,
    SUM(CASE WHEN (STR_TO_DATE(pi.released_date, '%Y-%m-%d') BETWEEN ? AND ?) THEN 1 ELSE 0 END) AS TotalReleasedInDateRange
FROM 
    prisioners_info pi
    LEFT JOIN cases c ON pi.case_id = c.id   
WHERE 
    pi.office_id = ? 
    GROUP BY 
    pi.case_id
HAVING 
    KaidiTotal> 0 OR 
    ThunuwaTotal > 0 OR 
    TotalArrestedInDateRange > 0 OR 
    TotalReleasedInDateRange > 0
ORDER BY c.name_np
    `;
    // AND 
    // (STR_TO_DATE(pi.karagar_date, '%Y-%m-%d') BETWEEN ? AND ?) 

    try {
        const params = [
            startDate, endDate,
            startDate, endDate,
            userToken.main_office,
            startDate, endDate
        ]
        // console.log(params)
        const result = await query(sql, params);

        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

export { router as commonRouter }
