import fs from "fs";
import pdf from "pdf-parse";

export class PDFService {
  /**
   * Extract text content from a PDF file
   */
  static async extractText(filePath: string): Promise<string> {
    try {
      const data = fs.readFileSync(filePath);
      const parsed = await pdf(data);
      return parsed.text;
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean up uploaded PDF file
   */
  static async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to cleanup file ${filePath}:`, error);
      // Don't throw error for cleanup failures
    }
  }
}
