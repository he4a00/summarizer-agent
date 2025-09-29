import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { Logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  Logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
