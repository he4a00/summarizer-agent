import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { generateQuiz } from './agent';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Next.js default ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate quiz from topic (text input)
app.post('/api/quiz/topic', async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({
        error: 'Topic is required and must be a string'
      });
    }

    if (numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({
        error: 'Number of questions must be between 1 and 20'
      });
    }

    console.log(`Generating quiz for topic: "${topic}" with ${numQuestions} questions`);
    
    const result = await generateQuiz({
      type: 'topic',
      content: topic,
      numQuestions: parseInt(numQuestions)
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error generating quiz from topic:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate quiz from PDF upload
app.post('/api/quiz/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'PDF file is required'
      });
    }

    const { numQuestions = 5 } = req.body;
    
    if (numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({
        error: 'Number of questions must be between 1 and 20'
      });
    }

    console.log(`Processing PDF: ${req.file.originalname}`);
    
    const result = await generateQuiz({
      type: 'pdf',
      content: req.file.path,
      numQuestions: parseInt(numQuestions)
    });

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error generating quiz from PDF:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    res.status(500).json({
      error: 'Failed to generate quiz from PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/quiz/topic',
      'POST /api/quiz/pdf'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Quiz Generator API running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/quiz/topic - Generate quiz from topic`);
  console.log(`   POST /api/quiz/pdf - Generate quiz from PDF upload`);
});

export default app;
