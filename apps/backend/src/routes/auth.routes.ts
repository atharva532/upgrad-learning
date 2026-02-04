/**
 * Authentication Routes
 * All auth-related API endpoints
 */

import { Router } from 'express';
import {
  requestOtpController,
  verifyOtpController,
  refreshTokenController,
  logoutController,
  getSessionController,
  getSessionsController,
  revokeSessionController,
  revokeAllSessionsController,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router: Router = Router();

// Public routes (no auth required)
router.post('/otp/request', requestOtpController);
router.post('/otp/verify', verifyOtpController);
router.post('/token/refresh', refreshTokenController);
router.post('/logout', logoutController); // Works with just refresh token

// Protected routes (access token required)
router.get('/session', requireAuth, getSessionController);
router.get('/sessions', requireAuth, getSessionsController);
router.delete('/sessions/:familyId', requireAuth, revokeSessionController);
router.delete('/sessions', requireAuth, revokeAllSessionsController);

export default router;
