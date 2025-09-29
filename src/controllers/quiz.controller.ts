import { Request, Response, NextFunction } from "express";
import { QuizService } from "../services/quiz.service";
import {
  ApiResponse,
  QuizResponse,
  TopicQuizRequest,
  PdfQuizRequest,
} from "../types/quiz.types";

export class QuizController {
  /**
   * Get quiz information and available endpoints
   */
  static async getQuizInfo(req: Request, res: Response) {
    res.json({
      success: true,
      service: "Quiz Generator API",
      endpoints: {
        "POST /api/v1/quiz/topic": "Generate quiz from text topic",
        "POST /api/v1/quiz/pdf": "Generate quiz from PDF upload",
        "POST /api/v1/quiz/summarize": "Summarize PDF content only",
        "POST /api/v1/quiz/markdown": "Convert PDF to Notion-style markdown",
      },
      limits: {
        maxQuestions: 20,
        minQuestions: 1,
        maxFileSize: "10MB",
        supportedFormats: ["PDF"],
      },
    });
  }

  /**
   * Generate quiz from topic
   */
  static async generateTopicQuiz(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { topic, numQuestions }: TopicQuizRequest = req.body;

      console.log(
        `Generating quiz for topic: "${topic}" with ${numQuestions} questions`
      );

      const result = await QuizService.generateTopicQuiz(topic, numQuestions);

      const response: ApiResponse<QuizResponse> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating topic quiz:", error);
      next(error);
    }
  }

  /**
   * Generate quiz from PDF upload
   */
  static async generatePdfQuiz(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const { numQuestions }: PdfQuizRequest = req.body;

      console.log(
        `Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`
      );

      const result = await QuizService.generatePdfQuiz(
        req.file.path,
        numQuestions
      );

      const response: ApiResponse<QuizResponse> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating PDF quiz:", error);
      next(error);
    }
  }

  /**
   * Summarize PDF content
   */
  static async summarizePdf(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      console.log(
        `Summarizing PDF: ${req.file.originalname} (${req.file.size} bytes)`
      );

      const result = await QuizService.summarizePdf(req.file.path);

      const response: ApiResponse<{ summary: string }> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      console.error("Error summarizing PDF:", error);
      next(error);
    }
  }

  /**
   * Convert PDF to Notion-style markdown
   */
  static async convertPdfToMarkdown(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      console.log(
        `Converting PDF to markdown: ${req.file.originalname} (${req.file.size} bytes)`
      );

      const result = await QuizService.convertPdfToMarkdown(req.file.path);

      const response: ApiResponse<{ markdown: string }> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      console.error("Error converting PDF to markdown:", error);
      next(error);
    }
  }
}
