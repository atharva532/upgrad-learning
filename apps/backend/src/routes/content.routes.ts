/**
 * Content Routes
 * API routes for content management (courses, series, episodes)
 */

import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  getCoursesController,
  getCourseByIdController,
  getSeriesController,
  getSeriesByIdController,
  getEpisodeByIdController,
} from '../controllers/content.controller.js';

const router: RouterType = Router();

// All content endpoints require authentication
router.get('/courses', requireAuth, getCoursesController);
router.get('/courses/:id', requireAuth, getCourseByIdController);
router.get('/series', requireAuth, getSeriesController);
router.get('/series/:id', requireAuth, getSeriesByIdController);
router.get('/series/:seriesId/episodes/:episodeId', requireAuth, getEpisodeByIdController);

export default router;
