import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', error);

  // Handle Multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
    
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      message: error.message
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: error.message
    });
  }

  // Handle generic errors
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal server error' : error.name || 'Error',
    message: message
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedPath: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /health',
      'GET /api/v1/quiz',
      'POST /api/v1/quiz/topic',
      'POST /api/v1/quiz/pdf'
    ]
  });
};
