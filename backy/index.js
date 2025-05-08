import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import session from 'express-session';
import "./models/association.js"
import dbConfig from './config/dbConfig.js';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import swaggerSetup from './swaggerSetup.js';  
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from 'path'
import { fileURLToPath } from 'url';
import morgan from 'morgan';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

morgan.token('id', function (req) {
  return req.id || '-';
});
morgan.token('date', function () {
  return new Date().toISOString();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "http://localhost:5600", "http://localhost:5173", "data:"],   
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
}));

const logFormat = '[:date] :method :url :status :response-time ms - :res[content-length]';

app.use(morgan(logFormat));

app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use(express.json());
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/admin', adminRoutes);

swaggerSetup(app);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
}); 