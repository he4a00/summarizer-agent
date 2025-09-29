export interface QuizQuestion {
  id: number;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizGenerationRequest {
  type: 'pdf' | 'topic';
  content: string;
  numQuestions?: number;
}

export interface QuizResponse {
  summary?: string;
  questions: QuizQuestion[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TopicQuizRequest {
  topic: string;
  numQuestions?: number;
}

export interface PdfQuizRequest {
  numQuestions?: number;
}
