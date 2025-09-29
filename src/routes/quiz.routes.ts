import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller";
import { uploadMiddleware } from "../middleware/upload.middleware";
import {
  validateTopicQuiz,
  validatePdfQuiz,
} from "../middleware/validation.middleware";

const router = Router();

// GET /api/v1/quiz - Get quiz service information
router.get("/", QuizController.getQuizInfo);

// POST /api/v1/quiz/topic - Generate quiz from topic
router.post("/topic", validateTopicQuiz, QuizController.generateTopicQuiz);

// POST /api/v1/quiz/pdf - Generate quiz from PDF upload
router.post(
  "/pdf",
  uploadMiddleware.single("pdf"),
  validatePdfQuiz,
  QuizController.generatePdfQuiz
);

// POST /api/v1/quiz/summarize - Summarize PDF content
router.post(
  "/summarize",
  uploadMiddleware.single("pdf"),
  (req, res, next) => {
    // Simple validation for PDF upload (no numQuestions needed)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: "PDF file is required",
      });
    }
    next();
  },
  QuizController.summarizePdf
);

// POST /api/v1/quiz/markdown - Convert PDF to Notion-style markdown
router.post(
  "/markdown",
  uploadMiddleware.single("pdf"),
  (req, res, next) => {
    // Simple validation for PDF upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: "PDF file is required",
      });
    }
    next();
  },
  QuizController.convertPdfToMarkdown
);

export default router;
