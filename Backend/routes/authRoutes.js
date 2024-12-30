import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import NepaliDate from 'nepali-datetime';

import { getUsers, createUser } from '../controllers/userController.js';
import verifyToken from '../middlewares/verifyToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-4-1'
// console.log(fy_date);

// Utility function to validate input
const validateLoginInput = (username, password) => {
    if (!username || !password) {
        return { isValid: false, message: "Username and Password are required." };
    }
    return { isValid: true }
}

// SQL query for fetching user details
const fetchUserQuery = `
    SELECT DISTINCT u.*, ut.ut_name AS usertype, o.office_np AS office_name, o.office_en AS office_name_en, o.id AS office_id,  b.b_name_np AS branch_name
    FROM users u
    LEFT JOIN usertype ut ON u.usertype = ut.id
    LEFT JOIN office o ON u.office_id = o.id
    LEFT JOIN branch b ON u.branch_id = b.id
    WHERE u.username = ?;
`;

// Route to login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // console.log('username:',username,'password:',password)

    //Validte input
    const validation = validateLoginInput(username, password);
    if (!validation.isValid) {
        return res.status(400).json({loginStatus: false,Error: validation.message});
    }

    try {
        //Query database for user
        con.query(fetchUserQuery, [username], (err, result) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).json({loginStatus: false,Error: "Database error"});
            }
            if (result.length === 0) {
                return res.status(401).json({ loginStatus: false, Error: "Invalid username" })
            }
            const user = result[0];
            // console.log(user);
            //Compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error("Password matching error:", err);
                    return res.status(500).json({ loginStatus: false, Error: "Server Error" });
                }

                if (!isMatch) {
                    return res.status(401).json({ loginStatus: false, Error: "Invalid Username or Password" })
                }

                //Generate JWT token
                const token = jwt.sign({
                    uid: user.uid,
                    role: user.usertype,
                    username: user.username,
                    office: user.office_id,
                    branch: user.branch
                },
                    process.env.JWT_SECRET,
                    { expiresIn: '3d' }
                );
                //Send response with token and user details
                res.cookie( 'token', token, { 
                            httpOnly: true, 
                            secure: true,
                            // secure: false, //for development only
                            sameSite:"strict",
                            maxAge:3*24*60*60*1000, //Expire after 3 days
                         });
                // console.log(user.branch_name)
                return res.json({
                    loginStatus: true,
                    token,
                    username: user.username,
                    branch: user.branch_name,
                    usertype: user.usertype,
                    office_np: user.office_name,
                    office_id: user.office_id,
                });
            });
        });
    }catch(err){
        console.error("Unexpected error:", err);
        return res.status(500).json({loginStatus:false, Error:"Server error"});
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Set to true in production
        sameSite: 'strict',
    });
    res.json({ logoutStatus: true, message: 'Logged out successfully' });
});


router.post('/check', verifyToken, (req, res) => {
    const {ram} = req.body;
    console.log("working", ram)
})

export { router as adminRouter }
