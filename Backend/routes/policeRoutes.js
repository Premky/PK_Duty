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

const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-4-1'
// console.log(fy_date);

router.post('/add_police', verifyToken, async (req, res) => {
    const user_token = req.user; // Details from token, 
    console.log('uid', user_token.uid);
    console.log('office', user_token.office);

    const { rank_id, name_np, name_en, address, darbandi, pmis, sanket,
        contact, blood_group, dob, working_from, recruit_date, promotion_date, qualification,
        gender, bp, height,
        weight, is_active } = req.body;
    console.log("Check Data:", req.body);

    //Input Validation
    if (!pmis || !sanket) {
        return res.status(400).json({
            Status: false,
            Error: 'Invalid input, All fields are required.',
        });
    }
    const sql = `INSERT INTO sec_employe(rank_id, name_np, name_en, address, darbandi, pmis, sanket,  
    contact, blood_group, dob, working_from, recruit_date, promotion_date, qualification,
    gender, bp, height, weight, is_active, office_id, created_by, created_at) VALUES (?)`;

    const values = [rank_id, name_np, name_en, address, darbandi, pmis, sanket,
        contact, blood_group, dob, working_from, recruit_date, promotion_date, qualification,
        gender, bp, height,
        weight, is_active, user_token.office, user_token.uid, new Date()
    ];
    console.log(values);

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

//Get Police Records
router.get('/get_police_records', async (req, res) => {
    // console.log('Rank working');
    const sql = `SELECT se.*, r.rank_np as ranknp, r.rank_en as ranken
                    FROM sec_employe se 
                    LEFT JOIN sec_ranks r ON se.rank_id = r.id   
                    WHERE is_active = TRUE                 
                    ORDER BY se.id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.put('/update_police/:id', verifyToken, async (req, res) => {
    const user_token = req.user; // Details from token, 
    // console.log('mainoffice', user_token.main_office);
    // console.log('office', user_token.office);

    const id = req.params.id;

    const { rank_id, name_np, name_en, address, darbandi, pmis, sanket,
        working_from, contact, blood_group, dob, gender, bp, height,
        weight, is_active } = req.body;
    console.log("Check Data:", id);

    //Input Validation
    if (!id || !pmis || !sanket) {
        return res.status(400).json({
            Status: false,
            Error: 'Invalid input, All fields are required.',
        });
    }

    const sql = `UPDATE sec_employe 
                SET
                rank_id=?, name_np=?, name_en=?, address=?, darbandi=?, pmis=?, sanket=?,
                working_from=?, contact=?, blood_group=?, dob=?, gender=?, bp=?, height=?,
                weight=?, is_active=?, updated_by=?, updated_at=? WHERE id=?`
    const values = [rank_id, name_np, name_en, address, darbandi, pmis, sanket,
        working_from, contact, blood_group, dob, gender, bp, height,
        weight, is_active, user_token.uid, new Date(), id
    ];
    console.log(values);

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

router.get('/get_posts', async (req, res) => {
    // console.log('Rank working');
    const sql = `SELECT * FROM sec_posts ORDER BY id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});


router.post("/generate_duty", async (req, res) => {
    // router.post("/generate_duty", verifyToken, async (req, res) => {
    const user_token = req.user;
    // const officeidbytoken = user_token.officeId;
    const officeidbytoken = 1
    const { date, officeId, commanderId, shifts, fixedAssignments } = req.body;

    try {
        const employees = await query(`SELECT * FROM sec_employe WHERE is_active = TRUE AND office_id=? 
                ORDER BY rank_id`, [officeidbytoken]);
        const posts = await query(`SELECT * FROM sec_posts WHERE office_id=?`, [officeidbytoken]);
        const dutySchedule = [];
        const remainingEmployees = employees.filter(emp => emp.id !== commanderId);

        //Assign commander 
        dutySchedule.push({
            date,
            shift: 1,
            post_id: "1",
            employee_id: commanderId
        });

        //Assign Serior Personnel 
        for (let i = 0; i < posts.length && i < 2; i++) {
            dutySchedule.push({
                date,
                shift: 1,
                post_id: posts[i].id,
                employee_id: remainingEmployees[i].id
            });
        }

        //Rotate Remaining Employees
        let employeeIndex = 2; // Start from 2nd senior
        for (let shift = 2; shift <= shifts; shift++) {
            for (let i = 2; i < posts.length; i++) {
                dutySchedule.push({
                    date,
                    shift,
                    post_id: posts[i].id,
                    employee_id: remainingEmployees[employeeIndex % remainingEmployees.length].id
                });
                employeeIndex++;
            }
        }

        // Insert Schedule into Database
        for (const duty of dutySchedule) {
            await query(
                "INSERT INTO duty_schedule (date, shift, post_id, employee_id) VALUES (?, ?, ?, ?)",
                [duty.date, duty.shift, duty.post_id, duty.employee_id]
            );
        }

        res.json({ message: "Duty schedule generated successfully!", dutySchedule });
    } catch (err) {
        res.status(500).send(err);

    }
})
//Common APIs
router.get('/ranks', async (req, res) => {
    // console.log('Rank working');
    const sql = `SELECT * FROM sec_ranks ORDER BY id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

router.get('/police_commander', verifyToken, async (req, res) => {
    // console.log('Rank working');
    const userToken = req.user;
    const main_office = userToken.main_office;

    const sql = `SELECT se.*, r.rank_np as ranknp, r.rank_en as ranken
                    FROM sec_employe se 
                    LEFT JOIN sec_ranks r ON se.rank_id = r.id 
                    WHERE is_active = TRUE AND 
                    is_commander = TRUE AND 
                    office_id=?                    
                    ORDER BY se.id`;
    // console.log(sql, main_office)
    try {
        const result = await query(sql, main_office);
        // console.log(result);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

export { router as policeRouter };
