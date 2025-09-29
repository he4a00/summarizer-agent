# Quiz Generator API Documentation

A REST API for generating multiple-choice questions from PDF documents or text topics using Google's Gemini AI.

## Base URL
```
http://localhost:3001
```

## Endpoints

### Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Generate Quiz from Topic
**POST** `/api/quiz/topic`

Generate quiz questions from a text topic.

**Request Body:**
```json
{
  "topic": "Angular Fundamentals",
  "numQuestions": 5
}
```

**Parameters:**
- `topic` (string, required): The topic to generate questions about
- `numQuestions` (number, optional): Number of questions (1-20, default: 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": 1,
        "question": "What is Angular?",
        "choices": {
          "A": "A JavaScript library",
          "B": "A TypeScript framework",
          "C": "A CSS framework",
          "D": "A database"
        },
        "answer": "B",
        "explanation": "Angular is a TypeScript-based web application framework."
      }
    ]
  }
}
```

### Generate Quiz from PDF
**POST** `/api/quiz/pdf`

Generate quiz questions from an uploaded PDF document.

**Request:**
- Content-Type: `multipart/form-data`
- File field: `pdf` (PDF file, max 10MB)
- Optional field: `numQuestions` (1-20, default: 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "• Key point 1\n• Key point 2\n...",
    "questions": [
      {
        "id": 1,
        "question": "Based on the document, what is...?",
        "choices": {
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        },
        "answer": "A",
        "explanation": "The document states that..."
      }
    ]
  }
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

**Common Error Codes:**
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

## Usage Examples

### JavaScript/TypeScript (Next.js)

```typescript
// Generate quiz from topic
const generateTopicQuiz = async (topic: string, numQuestions = 5) => {
  const response = await fetch('http://localhost:3001/api/quiz/topic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, numQuestions }),
  });
  
  return response.json();
};

// Generate quiz from PDF
const generatePdfQuiz = async (file: File, numQuestions = 5) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('numQuestions', numQuestions.toString());
  
  const response = await fetch('http://localhost:3001/api/quiz/pdf', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};
```

### cURL Examples

```bash
# Generate quiz from topic
curl -X POST http://localhost:3001/api/quiz/topic \
  -H "Content-Type: application/json" \
  -d '{"topic": "React Hooks", "numQuestions": 3}'

# Generate quiz from PDF
curl -X POST http://localhost:3001/api/quiz/pdf \
  -F "pdf=@document.pdf" \
  -F "numQuestions=5"
```

## Setup and Running

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

3. Start the API server:
```bash
npm run dev:api
```

The API will be available at `http://localhost:3001`.

## Integration with Next.js

The API is configured with CORS to allow requests from Next.js development servers (`localhost:3000`). For production, update the CORS configuration in `server.ts` to include your production domain.
