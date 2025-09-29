// index.ts
import "dotenv/config";
import fs from "fs";
import pdf from "pdf-parse";
import readline from "readline";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("Set GOOGLE_API_KEY in .env");

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

export async function loadPdf(path: string): Promise<string> {
  const data = fs.readFileSync(path);
  const parsed = await pdf(data);
  return parsed.text;
}

export async function summarizeText(text: string): Promise<string> {
  const prompt = `Summarize the following text into 6 concise bullet points (each one sentence). Output only the bullets.\n\n${text}`;
  const resp = await model.invoke([
    new SystemMessage("You are a concise summarization assistant."),
    new HumanMessage(prompt),
  ]);
  return contentToString(resp.content);
}

export async function generateMCQsFromSummary(
  summary: string,
  topic: string,
  num = 5
): Promise<any[]> {
  const prompt = `From the text below, generate ${num} multiple-choice questions for studying.
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

Text to use:\n\n${summary ? summary : topic}`;

  const resp = await model.invoke([
    new SystemMessage("You produce strictly JSON."),
    new HumanMessage(prompt),
  ]);

  const content = contentToString(resp.content);
  try {
    return JSON.parse(content);
  } catch (e) {
    // fallback: try to extract JSON substring
    const m = content.match(/\[.*\]/s);
    if (m) return JSON.parse(m[0]);
    throw new Error("Failed to parse JSON from model response:\n" + content);
  }
}

// New unified quiz generation function
export async function generateQuiz(input: {
  type: 'pdf' | 'topic';
  content: string; // PDF path or topic text
  numQuestions?: number;
}): Promise<{
  summary?: string;
  questions: any[];
}> {
  const { type, content, numQuestions = 5 } = input;
  
  let summary: string;
  
  if (type === 'pdf') {
    // Load and summarize PDF
    const pdfText = await loadPdf(content);
    summary = await summarizeText(pdfText);
  } else {
    // For topics, create a summary-like structure
    summary = await summarizeText(content);
  }
  
  // Generate questions from the summary
  const questions = await generateMCQsFromSummary(summary, content, numQuestions);
  
  return {
    summary: type === 'pdf' ? summary : undefined,
    questions
  };
}
