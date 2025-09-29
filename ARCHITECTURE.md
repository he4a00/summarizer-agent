# Quiz Generator API - Architecture Overview

## 🏗️ Express.js MVC Structure

This project now follows the standard Express.js application structure with clear separation of concerns:

### **Controllers** (`src/controllers/`)
Handle HTTP requests and responses, delegating business logic to services.

- **`health.controller.ts`** - Health check endpoint
- **`quiz.controller.ts`** - Quiz generation endpoints

### **Routes** (`src/routes/`)
Define API endpoints and connect them to controllers with appropriate middleware.

- **`health.routes.ts`** - Health check routes
- **`quiz.routes.ts`** - Quiz-related routes with validation and upload middleware
- **`index.ts`** - Main router that combines all route modules

### **Services** (`src/services/`)
Business logic layer that handles core functionality.

- **`ai.service.ts`** - AI/LLM integration (Gemini API)
- **`pdf.service.ts`** - PDF processing and file management
- **`quiz.service.ts`** - Quiz generation orchestration

### **Middleware** (`src/middleware/`)
Custom middleware for cross-cutting concerns.

- **`error.middleware.ts`** - Global error handling and 404 responses
- **`upload.middleware.ts`** - File upload configuration (Multer)
- **`validation.middleware.ts`** - Request validation for quiz endpoints

### **Types** (`src/types/`)
TypeScript type definitions for type safety.

- **`quiz.types.ts`** - All quiz-related interfaces and types

### **Utils** (`src/utils/`)
Utility functions and helpers.

- **`logger.ts`** - Structured logging utility

### **App Configuration** (`src/`)
- **`app.ts`** - Express app setup with middleware configuration
- **`server.ts`** - Server startup and environment validation

## 🔄 Request Flow

```
Client Request
    ↓
Express App (app.ts)
    ↓
Routes (src/routes/)
    ↓
Middleware (validation, upload, etc.)
    ↓
Controllers (src/controllers/)
    ↓
Services (src/services/)
    ↓
External APIs (Gemini AI)
    ↓
Response back to Client
```

## 📊 API Versioning

The API uses versioned endpoints:
- **v1**: `/api/v1/quiz/*` - Current stable version
- Health check remains unversioned: `/health`

## 🛡️ Error Handling

Centralized error handling with:
- **Global error middleware** - Catches all unhandled errors
- **Validation errors** - Input validation with detailed messages
- **File upload errors** - Multer-specific error handling
- **404 handler** - Provides available endpoints information

## 🔧 Middleware Stack

1. **CORS** - Cross-origin resource sharing
2. **Body parsing** - JSON and URL-encoded data
3. **Request logging** - Structured request logging
4. **Route-specific middleware**:
   - File upload (PDF endpoints)
   - Input validation
5. **Error handling** - Global error catching
6. **404 handler** - Catch-all for undefined routes

## 📈 Benefits of This Structure

### **Maintainability**
- Clear separation of concerns
- Easy to locate and modify specific functionality
- Consistent code organization

### **Scalability**
- Easy to add new endpoints
- Service layer can be reused across different controllers
- Middleware can be shared across routes

### **Testability**
- Each layer can be unit tested independently
- Services can be mocked for controller testing
- Clear dependencies make testing easier

### **Type Safety**
- Comprehensive TypeScript types
- Compile-time error detection
- Better IDE support and autocomplete

### **Professional Standards**
- Follows Express.js best practices
- Industry-standard MVC pattern
- Ready for team development

## 🚀 Development Workflow

1. **Add new feature**:
   - Define types in `src/types/`
   - Implement business logic in `src/services/`
   - Create controller methods in `src/controllers/`
   - Add routes in `src/routes/`
   - Add middleware if needed

2. **Testing**:
   - Unit test services independently
   - Integration test controllers with mocked services
   - End-to-end test complete request flow

3. **Deployment**:
   - Build with `npm run build`
   - Start production server with `npm start`

## 🔮 Future Enhancements

This structure makes it easy to add:
- **Authentication middleware**
- **Rate limiting**
- **Database integration** (add `src/models/` and `src/repositories/`)
- **WebSocket support**
- **Background job processing**
- **API documentation generation**
- **Monitoring and metrics**

The modular architecture ensures that new features can be added without disrupting existing functionality.
