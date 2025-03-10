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
import NepaliDateConverter from 'nepali-date-converter';

// Example BS date
// const dateBS = "2081-10-11"; // BS date as a string in 'YYYY-MM-DD' format

// Convert BS to AD
// const dateAD = NepaliDateConverter.parse(dateBS);

// console.log('Converted AD Date:', dateAD);

async function updateDobToAD() {
    try {
        const sql = `SELECT id, dob FROM prisioners_info WHERE dob IS NOT NULL`;
        const result = await query(sql);

        for (let i = 0; i < result.length; i++) {
            const dobBS = result[i].dob;
            const dobAD = NepaliDateConverter.parse(dobBS);
            const ad=dobAD.getAD();
            console.log('DOB_AD', ad);

            // Accessing year, month, and day using methods
            const year = ad.year;
            const month = ad.month+1;
            const day = ad.day+1;
                   
            const formattedDobAD = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            console.log('Formatted DOB_AD:', formattedDobAD);
            
            const sql1 = `UPDATE prisioners_info SET dob_ad=? WHERE id=?`;
            const values = [formattedDobAD, result[i].id];
            const result1 = await query(sql1, values);
            console.log(result1);
        }
    } catch (err) {
        console.error(err);
    }
}

// Call the function
// updateDobToAD();
router.get('/employee', async (req, res) => {
    const sql = `SELECT e.*, r.rank_en_name, r.rank_np_name 
                FROM employe e 
                LEFT JOIN ranks r ON r.id = e.rank_id ORDER BY merit_no, is_active`;
    try {
        const result = await query(sql);
        // console.log(result);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});


router.get('/office', (req, res) => {
    const sql = "SELECT * FROM office WHERE display=1";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/ranks', async(req, res) => {
    const sql = "SELECT * FROM ranks";
    try {
        const result = await query(sql);
        // console.log(result);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.get('/notices', async(req,res)=>{
    const sql = "SELECT * FROM notices";
    try{
        const result = await query(sql);
        return res.json({Status:true, Result: result});
    }catch(err){
        console.error('Database query error:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})





router.get('/get_prisioners_report', verifyToken, async (req, res) => {
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
    SUM(CASE WHEN release_id IS NULL AND pa.gender = 'M' THEN 1 ELSE 0 END) AS Nabalak,
    SUM(CASE WHEN release_id IS NULL AND pa.gender = 'F' THEN 1 ELSE 0 END) AS Nabalika,

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
WHERE
    pi.office_id = ? AND pi.karagar_date <= '${endDate}'
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


export { router as dispalyRouter }
