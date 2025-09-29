# Quiz Generator API

A powerful REST API that generates multiple-choice questions from PDF documents or text topics using Google's Gemini AI. Perfect for educational applications, study tools, and quiz platforms.

## 🚀 Features

- **PDF Processing**: Upload PDF documents and generate quizzes from their content
- **Topic-based Generation**: Create quizzes from any text topic
- **AI-Powered**: Uses Google's Gemini 2.0 Flash model for intelligent question generation
- **RESTful API**: Easy integration with web applications (Next.js, React, etc.)
- **File Upload Support**: Handles PDF uploads up to 10MB
- **CORS Enabled**: Ready for frontend integration
- **TypeScript**: Fully typed for better development experience

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI API key (Gemini)

## 🛠️ Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **Get your Google AI API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an API key
   - Add it to your `.env` file

## 🚦 Usage

### Start the API Server

```bash
# Development mode
npm run dev:api

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3001`

### Test the API

```bash
# Run the test client
npm run dev:test
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Get Quiz Service Info
```http
GET /api/v1/quiz
```

### Generate Quiz from Topic
```http
POST /api/v1/quiz/topic
Content-Type: application/json

{
  "topic": "React Hooks",
  "numQuestions": 5
}
```

### Generate Quiz from PDF
```http
POST /api/v1/quiz/pdf
Content-Type: multipart/form-data

pdf: [PDF file]
numQuestions: 5
```

### Summarize PDF Content
```http
POST /api/v1/quiz/summarize
Content-Type: multipart/form-data

pdf: [PDF file]
```

## 💻 Integration Examples

### Next.js/React

```typescript
// utils/quizApi.ts
const API_BASE = 'http://localhost:3001';

export const generateTopicQuiz = async (topic: string, numQuestions = 5) => {
  const response = await fetch(`${API_BASE}/api/v1/quiz/topic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, numQuestions }),
  });
  return response.json();
};

export const generatePdfQuiz = async (file: File, numQuestions = 5) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('numQuestions', numQuestions.toString());
  
  const response = await fetch(`${API_BASE}/api/v1/quiz/pdf`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const summarizePdf = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await fetch(`${API_BASE}/api/v1/quiz/summarize`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

// components/QuizGenerator.tsx
import { useState } from 'react';
import { generateTopicQuiz } from '../utils/quizApi';

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateTopicQuiz(topic, 5);
      setQuiz(result.data);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>
      
      {quiz && (
        <div>
          {quiz.questions.map((q, index) => (
            <div key={q.id}>
              <h3>Question {index + 1}: {q.question}</h3>
              <ul>
                {Object.entries(q.choices).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
              <p><strong>Answer:</strong> {q.answer}</p>
              <p><em>{q.explanation}</em></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 📁 Project Structure

```
summarizer-agent/
├── src/                    # Source code (new structured approach)
│   ├── controllers/        # Request handlers
│   │   ├── health.controller.ts
│   │   └── quiz.controller.ts
│   ├── routes/            # API routes
│   │   ├── health.routes.ts
│   │   ├── quiz.routes.ts
│   │   └── index.ts
│   ├── services/          # Business logic
│   │   ├── ai.service.ts
│   │   ├── pdf.service.ts
│   │   └── quiz.service.ts
│   ├── middleware/        # Custom middleware
│   │   ├── error.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── validation.middleware.ts
│   ├── types/            # TypeScript type definitions
│   │   └── quiz.types.ts
│   ├── utils/            # Utility functions
│   │   └── logger.ts
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── agent.ts              # Legacy core functions (kept for reference)
├── server.ts             # Legacy server (kept for reference)
├── index.ts              # CLI version
├── test-client.ts        # API test client
├── API.md               # Detailed API documentation
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .env                 # Environment variables (create this)
└── uploads/             # Temporary PDF storage (auto-created)
```

## 🔧 Available Scripts

- `npm run dev` - Run CLI version
- `npm run dev:api` - Start API server in development
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run start:cli` - Run built CLI version

## 🎯 Response Format

### Topic Quiz Response
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": 1,
        "question": "What is React?",
        "choices": {
          "A": "A JavaScript library",
          "B": "A CSS framework", 
          "C": "A database",
          "D": "A server"
        },
        "answer": "A",
        "explanation": "React is a JavaScript library for building user interfaces."
      }
    ]
  }
}
```

### PDF Quiz Response
```json
{
  "success": true,
  "data": {
    "summary": "• Key point 1\n• Key point 2\n• Key point 3...",
    "questions": [...]
  }
}
```

## ⚙️ Configuration

### CORS Settings
The API is configured to accept requests from:
- `http://localhost:3000` (Next.js default)
- `http://127.0.0.1:3000`

For production, update the CORS configuration in `server.ts`:

```typescript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

### File Upload Limits
- Maximum file size: 10MB
- Supported format: PDF only
- Files are automatically deleted after processing

## 🚨 Error Handling

The API returns structured error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

## 🤔 Is This an "Agent"?

This application is more accurately described as a **quiz generation service** rather than a true AI agent. Here's why:

**Current Implementation:**
- ✅ Processes inputs (PDF/topic)
- ✅ Uses AI for content generation
- ✅ Provides structured outputs
- ❌ No autonomous decision-making
- ❌ No goal-oriented behavior
- ❌ No dynamic tool usage

**To make it more "agent-like," you could add:**
- Memory of previous quizzes
- Adaptive difficulty based on user performance
- Multi-step reasoning for complex topics
- Integration with external knowledge sources

## 🔮 Future Enhancements

- [ ] User authentication and quiz history
- [ ] Difficulty level selection
- [ ] Support for other document formats (Word, PowerPoint)
- [ ] Question type variety (true/false, fill-in-the-blank)
- [ ] Quiz analytics and performance tracking
- [ ] Batch processing for multiple files
- [ ] Custom question templates

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the [API documentation](API.md)
2. Review the test client examples
3. Open an issue on the repository

---

**Ready to integrate with your Next.js app!** 🎉

The API is fully functional and ready for production use. Simply start the server with `npm run dev:api` and begin making requests from your frontend application.
#   s u m m a r i z e r - a g e n t  
 #   s u m m a r i z e r - a g e n t  
 #   s u m m a r i z e r - a g e n t  
 