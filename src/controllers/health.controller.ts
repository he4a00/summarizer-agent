import { Request, Response } from 'express';

export class HealthController {
  /**
   * Health check endpoint
   */
  static async getHealth(req: Request, res: Response) {
    res.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Quiz Generator API',
      version: '1.0.0'
    });
  }
}
