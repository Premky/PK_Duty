//Using Cookies

import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Retrieve the token from cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        // console.log(decoded);
        req.user = decoded; // Attach user to request object
        next();
    });
};

export default verifyToken;

// Example usage of middleware
// app.get('/protected', authenticateToken, (req, res) => {
//     res.json({ message: "Access granted!", user: req.user });
// });
