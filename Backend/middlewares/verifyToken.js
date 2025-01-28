import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // console.log('Received cookies:', req.cookies);

    // Get token from cookies or authorization header
    const cookietoken = req.cookies.token;
    const headertoken = req.headers['authorization']?.split(' ')[1];  // Make sure to split correctly

    let token = cookietoken || headertoken; // If a cookie token exists, use it; otherwise, use the header token

    // console.log('Cookie token:', cookietoken, 'Header token:', headertoken);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err.message);
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        // console.log('Decoded token:', decoded);
        
        req.user = decoded; // Attach the decoded user data to the request
        next();
    });
};

export default verifyToken;