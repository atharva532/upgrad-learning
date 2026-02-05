/**
 * Interest Service
 * Handles interest data operations
 */

import { prisma } from '../lib/prisma.js';

/**
 * Get all available interests
 */
export async function getAllInterests() {
  return prisma.interest.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Save user's selected interests
 * @param userId - The user's ID
 * @param interestIds - Array of interest IDs to save
 */
export async function saveUserInterests(userId: string, interestIds: string[]) {
  // Delete existing interests (if any) to handle re-submission
  await prisma.userInterest.deleteMany({
    where: { userId },
  });

  // Create new user interests with default weight
  const userInterests = await prisma.userInterest.createMany({
    data: interestIds.map((interestId) => ({
      userId,
      interestId,
      weight: 1.0,
    })),
  });

  return userInterests;
}

/**
 * Get user's saved interests
 * @param userId - The user's ID
 */
export async function getUserInterests(userId: string) {
  return prisma.userInterest.findMany({
    where: { userId },
    include: {
      interest: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Check if user has completed onboarding (has any interests)
 * @param userId - The user's ID
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const count = await prisma.userInterest.count({
    where: { userId },
  });
  return count > 0;
}

/**
 * Validate that all interest IDs exist
 * @param interestIds - Array of interest IDs to validate
 */
export async function validateInterestIds(interestIds: string[]): Promise<boolean> {
  const count = await prisma.interest.count({
    where: {
      id: { in: interestIds },
    },
  });
  return count === interestIds.length;
}
