// Simple test client to demonstrate API usage
import fetch from 'node-fetch';

// Type definitions for API responses
interface QuizQuestion {
  id: number;
  question: string;
  choices: { A: string; B: string; C: string; D: string; };
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const API_BASE = 'http://localhost:3001';

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }
}

async function testQuizInfo() {
  console.log('\n📋 Testing quiz service info...');
  try {
    const response = await fetch(`${API_BASE}/api/v1/quiz`);
    const data = await response.json();
    console.log('✅ Quiz service info:', data);
  } catch (error) {
    console.error('❌ Quiz info failed:', error);
  }
}

async function testTopicQuiz() {
  console.log('\n🧠 Testing topic quiz generation...');
  try {
    const response = await fetch(`${API_BASE}/api/v1/quiz/topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'React Hooks and State Management',
        numQuestions: 3
      })
    });
    
    const data = await response.json() as ApiResponse<{ questions: QuizQuestion[] }>;
    console.log('✅ Topic quiz generated successfully!');
    console.log(`📝 Generated ${data.data?.questions.length || 0} questions`);
    
    // Show first question as example
    if (data.data?.questions && data.data.questions.length > 0) {
      const firstQ = data.data.questions[0];
      console.log('\n📋 Sample Question:');
      console.log(`Q: ${firstQ.question}`);
      console.log(`Choices:`, firstQ.choices);
      console.log(`Answer: ${firstQ.answer}`);
      console.log(`Explanation: ${firstQ.explanation}`);
    }
  } catch (error) {
    console.error('❌ Topic quiz failed:', error);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  await testQuizInfo();
  await testTopicQuiz();
  
  console.log('\n✨ Tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}
