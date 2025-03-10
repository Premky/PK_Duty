import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import { adminRouter } from './routes/authRoutes.js';
import { policeRouter } from './routes/policeRoutes.js';
import { prisionerRouter } from './routes/prisionerRoutes.js';
import { commonRouter } from './routes/commonRoutes.js';
import { dispalyRouter } from './routes/displayRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for security and JSON parsing
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
    origin: (origin, callback) => {        
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://192.168.1.21:5173',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, //Allow credentials (cookies) to be sent
}));

// Static file serving
app.use(express.static('Public'));
app.use('/Uploads', express.static(path.join(__dirname, 'Public', 'Uploads')));

// Routes
app.use('/auth', adminRouter)
app.use('/common', commonRouter)
app.use('/police', policeRouter)
app.use('/prisioner', prisionerRouter)
app.use('/display', dispalyRouter)

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    process.exit();
});
