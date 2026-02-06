/**
 * Interest Routes
 * API routes for interest management
 */

import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  getInterestsController,
  saveUserInterestsController,
  getUserInterestsController,
} from '../controllers/interest.controller.js';

const router: RouterType = Router();

// Public endpoint - get all available interests
router.get('/', getInterestsController);

// Protected endpoints - require authentication
router.get('/user', requireAuth, getUserInterestsController);
router.post('/user', requireAuth, saveUserInterestsController);

export default router;
