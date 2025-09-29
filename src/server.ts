import "dotenv/config";
import app from "./app";
import { Logger } from "./utils/logger";

const PORT = process.env.PORT || 3002;

// Validate required environment variables
if (!process.env.GOOGLE_API_KEY) {
  Logger.error("GOOGLE_API_KEY is required in environment variables");
  process.exit(1);
}

// Start server
const server = app.listen(PORT, () => {
  Logger.info(`🚀 Quiz Generator API running on http://localhost:${PORT}`);
  Logger.info(`📚 Available endpoints:`);
  Logger.info(`   GET  /health - Health check`);
  Logger.info(`   GET  /api/v1/quiz - Quiz service info`);
  Logger.info(`   POST /api/v1/quiz/topic - Generate quiz from topic`);
  Logger.info(`   POST /api/v1/quiz/pdf - Generate quiz from PDF upload`);
  Logger.info(`   POST /api/v1/quiz/summarize - Summarize PDF content`);
  Logger.info(`   POST /api/v1/quiz/markdown - Convert PDF to Notion markdown`);
  Logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  Logger.info(`🔄 Server is ready and listening for requests...`);
});

// Handle server errors
server.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    Logger.error(
      `Port ${PORT} is already in use. Please use a different port or stop the existing server.`
    );
  } else {
    Logger.error("Server error:", error);
  }
  process.exit(1);
});

// Keep the process alive
process.on("uncaughtException", (error) => {
  Logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  Logger.error("Unhandled Rejection at promise:", reason);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  Logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  Logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});
