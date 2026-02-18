/**
 * Content Controller
 * Handles content-related HTTP requests
 */

import { Request, Response } from 'express';
import {
  getAllCourses,
  getCourseById,
  getAllSeries,
  getSeriesById,
  getEpisodeById,
} from '../services/content.service.js';

/**
 * GET /api/content/courses
 * Returns all standalone courses
 */
export async function getCoursesController(_req: Request, res: Response): Promise<void> {
  try {
    const courses = await getAllCourses();

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses',
    });
  }
}

/**
 * GET /api/content/courses/:id
 * Returns a single course by ID
 */
export async function getCourseByIdController(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);

    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found',
      });
      return;
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course',
    });
  }
}

/**
 * GET /api/content/series
 * Returns all series with episodes
 */
export async function getSeriesController(_req: Request, res: Response): Promise<void> {
  try {
    const series = await getAllSeries();

    res.json({
      success: true,
      data: series,
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch series',
    });
  }
}

/**
 * GET /api/content/series/:id
 * Returns a single series with episodes
 */
export async function getSeriesByIdController(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const series = await getSeriesById(id);

    if (!series) {
      res.status(404).json({
        success: false,
        error: 'Series not found',
      });
      return;
    }

    res.json({
      success: true,
      data: series,
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch series',
    });
  }
}

/**
 * GET /api/content/series/:seriesId/episodes/:episodeId
 * Returns a single episode with its series info
 */
export async function getEpisodeByIdController(
  req: Request<{ seriesId: string; episodeId: string }>,
  res: Response
): Promise<void> {
  try {
    const { seriesId, episodeId } = req.params;
    const episode = await getEpisodeById(seriesId, episodeId);

    if (!episode) {
      res.status(404).json({
        success: false,
        error: 'Episode not found',
      });
      return;
    }

    res.json({
      success: true,
      data: episode,
    });
  } catch (error) {
    console.error('Error fetching episode:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch episode',
    });
  }
}
