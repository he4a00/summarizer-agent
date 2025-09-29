import { Router } from 'express';
import healthRoutes from './health.routes';
import quizRoutes from './quiz.routes';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/api/v1/quiz', quizRoutes);

export default router;
