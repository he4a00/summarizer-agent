import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { QuizQuestion } from "../types/quiz.types";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is required in environment variables");
}

const model = new ChatGoogleGenerativeAI({
  model: MODEL_NAME,
  apiKey: API_KEY,
  temperature: 0,
});

// Normalize LangChain AI message content to a plain string
function contentToString(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part: any) => {
        if (part && typeof part === "object") {
          if (typeof part.text === "string") return part.text;
          if (typeof part.input_text === "string") return part.input_text;
        }
        return "";
      })
      .join("");
  }
  if (content == null) return "";
  try {
    return String(content);
  } catch {
    return "";
  }
}

export class AIService {
  /**
   * Summarize text into concise bullet points
   */
  static async summarizeText(text: string): Promise<string> {
    const prompt = `Summarize the following text into 6 concise bullet points (each one sentence). Output only the bullets.\n\n${text}`;
    
    const resp = await model.invoke([
      new SystemMessage("You are a concise summarization assistant."),
      new HumanMessage(prompt),
    ]);
    
    return contentToString(resp.content);
  }

  /**
   * Convert PDF text content to Notion-style markdown
   */
  static async convertPdfToMarkdown(text: string): Promise<string> {
    const prompt = `Convert the following text content (extracted from a PDF) into clean, well-structured Notion-style markdown format.

FORMATTING GUIDELINES:
- Use proper heading hierarchy (# ## ### #### ##### ######)
- Create bullet points with - for lists
- Use numbered lists (1. 2. 3.) where appropriate
- Format code blocks with \`\`\` when applicable
- Use **bold** for emphasis and *italics* for secondary emphasis
- Create tables using | syntax when tabular data is present
- Use > for callouts/quotes
- Add horizontal rules (---) to separate major sections
- Preserve important formatting like dates, numbers, and technical terms
- Remove any OCR artifacts or formatting noise
- Organize content logically with clear section breaks
- Use checkboxes - [ ] for task lists if applicable

STRUCTURE REQUIREMENTS:
- Start with a clear title using # 
- Use consistent heading levels for hierarchy
- Group related content under appropriate headings
- Maintain readability and logical flow
- Preserve all important information while improving readability

TEXT TO CONVERT:

${text}`;
    
    const resp = await model.invoke([
      new SystemMessage("You are an expert technical writer specializing in converting documents to clean, well-structured Notion-style markdown. Focus on readability, proper formatting, and logical organization."),
      new HumanMessage(prompt),
    ]);
    
    return contentToString(resp.content);
  }

  /**
   * Generate multiple choice questions from content
   */
  static async generateMCQs(
    content: string,
    numQuestions: number = 5
  ): Promise<QuizQuestion[]> {
    const prompt = `From the text below, generate ${numQuestions} multiple-choice questions for studying.
Each question must be an object with these fields:
  - id: number
  - question: short question text
  - choices: object with keys "A","B","C","D"
  - answer: one uppercase letter "A","B","C",or "D"
  - explanation: 1-2 sentence explanation of the correct answer

Output must be a valid JSON array ONLY (no extra commentary). Example:
[
  {"id":1,"question":"...","choices":{"A":"..","B":"..","C":"..","D":".."},"answer":"B","explanation":"..."},
  ...
]

Text to use:\n\n${content}`;

    const resp = await model.invoke([
      new SystemMessage("You produce strictly JSON."),
      new HumanMessage(prompt),
    ]);

    const responseContent = contentToString(resp.content);
    
    try {
      const questions = JSON.parse(responseContent);
      return questions as QuizQuestion[];
    } catch (e) {
      // Fallback: try to extract JSON substring
      const match = responseContent.match(/\[.*\]/s);
      if (match) {
        return JSON.parse(match[0]) as QuizQuestion[];
      }
      throw new Error(`Failed to parse JSON from AI response: ${responseContent}`);
    }
  }
}
