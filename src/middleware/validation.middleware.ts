import { Request, Response, NextFunction } from 'express';
import { TopicQuizRequest, PdfQuizRequest } from '../types/quiz.types';

export const validateTopicQuiz = (req: Request, res: Response, next: NextFunction) => {
  const { topic, numQuestions }: TopicQuizRequest = req.body;
  
  // Validate topic
  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Topic is required and must be a non-empty string'
    });
  }

  // Validate numQuestions
  if (numQuestions !== undefined) {
    const num = parseInt(numQuestions.toString());
    if (isNaN(num) || num < 1 || num > 20) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Number of questions must be between 1 and 20'
      });
    }
    req.body.numQuestions = num;
  } else {
    req.body.numQuestions = 5; // Default value
  }

  next();
};

export const validatePdfQuiz = (req: Request, res: Response, next: NextFunction) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'PDF file is required'
    });
  }

  // Validate numQuestions from form data
  const { numQuestions }: PdfQuizRequest = req.body;
  
  if (numQuestions !== undefined) {
    const num = parseInt(numQuestions.toString());
    if (isNaN(num) || num < 1 || num > 20) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Number of questions must be between 1 and 20'
      });
    }
    req.body.numQuestions = num;
  } else {
    req.body.numQuestions = 5; // Default value
  }

  next();
};
