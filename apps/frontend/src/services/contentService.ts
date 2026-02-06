/**
 * Content Service
 * Fetches video content for homepage sections using static course data
 */

import { Video, WatchProgress } from '../types/content.types';
import { COURSES, INTEREST_CATEGORY_MAP, EXPLORATION_CATEGORIES } from '../data/courses';

const CONTINUE_WATCHING_KEY = 'continueWatching';
const WATCH_HISTORY_KEY = 'watchHistory';

export interface WatchHistoryEntry {
  courseId: string;
  progress: number;
  lastWatched: string;
}

/**
 * Get continue watching video (single item)
 * Returns null if no in-progress content
 */
export async function getContinueWatching(): Promise<Video | null> {
  try {
    const saved = localStorage.getItem(CONTINUE_WATCHING_KEY);
    if (!saved) return null;

    const watchProgress: WatchProgress = JSON.parse(saved);

    // Only show if progress is between 1-99%
    if (watchProgress.progress <= 0 || watchProgress.progress >= 100) {
      return null;
    }

    // Find the course from static data
    const course = COURSES.find((c) => c.id === watchProgress.videoId);
    if (!course) return null;

    return {
      ...course,
      progress: watchProgress.progress,
    };
  } catch (error) {
    console.error('Error fetching continue watching:', error);
    return null;
  }
}

/**
 * Save watch progress for a video
 */
export function saveWatchProgress(videoId: string, progress: number): void {
  const watchProgress: WatchProgress = {
    videoId,
    progress: Math.min(100, Math.max(0, progress)),
    lastWatched: new Date().toISOString(),
  };
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(watchProgress));

  // Also update watch history
  updateWatchHistory(videoId, progress);
}

/**
 * Update watch history with multiple courses
 */
function updateWatchHistory(courseId: string, progress: number): void {
  try {
    const history = getWatchHistory();
    const existingIndex = history.findIndex((h) => h.courseId === courseId);

    const entry: WatchHistoryEntry = {
      courseId,
      progress,
      lastWatched: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      history[existingIndex] = entry;
    } else {
      history.unshift(entry);
    }

    // Keep last 20 entries
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (error) {
    console.error('Error updating watch history:', error);
  }
}

/**
 * Get watch history
 */
export function getWatchHistory(): WatchHistoryEntry[] {
  try {
    const saved = localStorage.getItem(WATCH_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Clear continue watching data
 */
export function clearContinueWatching(): void {
  localStorage.removeItem(CONTINUE_WATCHING_KEY);
}

/**
 * Get interest-based recommendations
 * Maps user interests to relevant courses
 */
export async function getRecommendations(interestIds: string[]): Promise<Video[]> {
  try {
    // Get categories for user interests
    const categories = new Set<string>();
    interestIds.forEach((id) => {
      const cats = INTEREST_CATEGORY_MAP[id] || [];
      cats.forEach((cat) => categories.add(cat));
    });

    // If no interests, return first 6 courses (excluding exploration)
    if (categories.size === 0) {
      return COURSES.filter((c) => !EXPLORATION_CATEGORIES.includes(c.category)).slice(0, 6);
    }

    // Filter courses by matching categories
    const matchingCourses = COURSES.filter(
      (c) => categories.has(c.category) && !EXPLORATION_CATEGORIES.includes(c.category)
    );

    // Shuffle and return up to 8
    return shuffleArray(matchingCourses).slice(0, 8);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

/**
 * Get exploration content (outside user interests)
 * Returns content from different categories to encourage discovery
 */
export async function getExplorationContent(): Promise<Video[]> {
  try {
    // Get exploration courses
    const explorationCourses = COURSES.filter((c) => EXPLORATION_CATEGORIES.includes(c.category));

    return shuffleArray(explorationCourses).slice(0, 6);
  } catch (error) {
    console.error('Error fetching exploration content:', error);
    return [];
  }
}

/**
 * Get all courses (for browsing)
 */
export function getAllCourses(): Video[] {
  return COURSES;
}

/**
 * Get a specific course by ID
 */
export function getCourseById(id: string): Video | undefined {
  return COURSES.find((c) => c.id === id);
}

/**
 * Shuffle array helper
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
