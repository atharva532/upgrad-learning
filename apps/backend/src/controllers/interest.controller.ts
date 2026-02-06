/**
 * Interest Controller
 * Handles interest-related HTTP requests
 */

import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import {
  getAllInterests,
  saveUserInterests,
  getUserInterests,
  validateInterestIds,
} from '../services/interest.service.js';

/**
 * GET /api/interests
 * Returns all available interests (public endpoint)
 */
export async function getInterestsController(_req: Request, res: Response): Promise<void> {
  try {
    const interests = await getAllInterests();

    res.json({
      success: true,
      data: interests,
    });
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interests',
    });
  }
}

/**
 * POST /api/interests/user
 * Save user's selected interests (authenticated endpoint)
 */
export async function saveUserInterestsController(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED',
      });
      return;
    }

    const { interestIds } = req.body;

    // Validate input
    if (!interestIds || !Array.isArray(interestIds)) {
      res.status(400).json({
        success: false,
        error: 'interestIds must be an array',
        code: 'INVALID_INPUT',
      });
      return;
    }

    if (interestIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'At least one interest must be selected',
        code: 'NO_INTERESTS_SELECTED',
      });
      return;
    }

    // Validate that all interest IDs exist
    const allValid = await validateInterestIds(interestIds);
    if (!allValid) {
      res.status(400).json({
        success: false,
        error: 'One or more interest IDs are invalid',
        code: 'INVALID_INTEREST_IDS',
      });
      return;
    }

    // Save interests
    await saveUserInterests(userId, interestIds);

    res.json({
      success: true,
      message: 'Interests saved successfully',
    });
  } catch (error) {
    console.error('Error saving user interests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save interests',
    });
  }
}

/**
 * GET /api/interests/user
 * Get user's saved interests (authenticated endpoint)
 */
export async function getUserInterestsController(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED',
      });
      return;
    }

    const userInterests = await getUserInterests(userId);

    res.json({
      success: true,
      data: userInterests.map((ui: { interest: { id: string; name: string }; weight: number }) => ({
        id: ui.interest.id,
        name: ui.interest.name,
        weight: ui.weight,
      })),
    });
  } catch (error) {
    console.error('Error fetching user interests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user interests',
    });
  }
}
