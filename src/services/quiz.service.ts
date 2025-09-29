import { QuizGenerationRequest, QuizResponse } from "../types/quiz.types";
import { AIService } from "./ai.service";
import { PDFService } from "./pdf.service";

export class QuizService {
  /**
   * Generate quiz from either PDF or topic
   */
  static async generateQuiz(request: QuizGenerationRequest): Promise<QuizResponse> {
    const { type, content, numQuestions = 5 } = request;
    
    let textContent: string;
    let summary: string | undefined;
    
    if (type === 'pdf') {
      // Extract text from PDF and create summary
      textContent = await PDFService.extractText(content);
      summary = await AIService.summarizeText(textContent);
      
      // Use summary for question generation to ensure focused questions
      textContent = summary;
    } else {
      // For topics, use the content directly and create a summary
      summary = await AIService.summarizeText(content);
      textContent = summary;
    }
    
    // Generate questions from the processed content
    const questions = await AIService.generateMCQs(textContent, numQuestions);
    
    return {
      summary: type === 'pdf' ? summary : undefined,
      questions
    };
  }

  /**
   * Generate quiz from topic text
   */
  static async generateTopicQuiz(topic: string, numQuestions: number = 5): Promise<QuizResponse> {
    return this.generateQuiz({
      type: 'topic',
      content: topic,
      numQuestions
    });
  }

  /**
   * Generate quiz from PDF file
   */
  static async generatePdfQuiz(filePath: string, numQuestions: number = 5): Promise<QuizResponse> {
    try {
      const result = await this.generateQuiz({
        type: 'pdf',
        content: filePath,
        numQuestions
      });
      
      // Clean up the uploaded file
      await PDFService.cleanupFile(filePath);
      
      return result;
    } catch (error) {
      // Ensure cleanup even if quiz generation fails
      await PDFService.cleanupFile(filePath);
      throw error;
    }
  }

  /**
   * Get summarized text from PDF file
   */
  static async summarizePdf(filePath: string): Promise<{ summary: string }> {
    try {
      // Extract text from PDF
      const textContent = await PDFService.extractText(filePath);
      
      // Generate summary
      const summary = await AIService.summarizeText(textContent);
      
      // Clean up the uploaded file
      await PDFService.cleanupFile(filePath);
      
      return { summary };
    } catch (error) {
      // Ensure cleanup even if summarization fails
      await PDFService.cleanupFile(filePath);
      throw error;
    }
  }

  /**
   * Convert PDF to Notion-style markdown
   */
  static async convertPdfToMarkdown(filePath: string): Promise<{ markdown: string }> {
    try {
      // Extract text from PDF
      const textContent = await PDFService.extractText(filePath);
      
      // Convert to markdown
      const markdown = await AIService.convertPdfToMarkdown(textContent);
      
      // Clean up the uploaded file
      await PDFService.cleanupFile(filePath);
      
      return { markdown };
    } catch (error) {
      // Ensure cleanup even if conversion fails
      await PDFService.cleanupFile(filePath);
      throw error;
    }
  }
}
