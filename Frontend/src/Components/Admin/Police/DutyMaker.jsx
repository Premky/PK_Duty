import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const DutyMaker = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');


    const [posts, setPosts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [rotation, setRotation] = useState([]);
    const [rules, setRules] = useState([]);

    // Fetch posts and employees
    useEffect(() => {
        const fetchData = async () => {
            const postResponse = await axios.get(`${BASE_URL}/police/get_posts`);
            const employeeResponse = await axios.get(`${BASE_URL}/police/get_police_records`);
            setPosts(postResponse.data);
            setEmployees(employeeResponse.data);
            console.log(postResponse.data);
            console.log(employeeResponse.data);
        };
        fetchData();
    }, []);

    // Handle rotation generation
    const generateRotation = () => {
        let dutyRotation = [];
        let usedEmployees = new Set();

        posts.forEach((post) => {
            const eligibleEmployees = employees.filter((employee) => {
                // Apply rules
                if (post.name === "Checkpost" && !["प्रह", "प्रवह", "प्रसनि"].includes(employee.ranknp))
                    return false;
                if (post.name === "1" && employee.rank === "AHC") return false;

                return !usedEmployees.has(employee.id);
            });

            if (eligibleEmployees.length > 0) {
                const assignedEmployee = eligibleEmployees[0];
                dutyRotation.push({ post: post.name, employee: assignedEmployee.name });
                usedEmployees.add(assignedEmployee.id);
            }
        });

        setRotation(dutyRotation);
    };

    // Save rotation to backend
    const saveRotation = async () => {
        await axios.post("/api/rotation", { rotation });
        alert("Rotation saved successfully!");
    };

    return (
        <div>
            <h1>Automatic Duty Rotation</h1>
            <button onClick={generateRotation}>Generate Rotation</button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Post</TableCell>
                            <TableCell>Assigned Employee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rotation.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.post}</TableCell>
                                <TableCell>{item.employee}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={generateRotation}>
                Generate Rotation
            </Button>
            {rotation.length > 0 && (
                <Button variant="contained" color="secondary" onClick={saveRotation}>
                    Save Rotation
                </Button>
            )}

            {rotation.length > 0 && <button onClick={saveRotation}>Save Rotation</button>}
        </div>
    );
};

export default DutyMaker;
