/**
 * Content Service
 * Fetches video and series content for homepage sections using static course data
 */

import { Video, WatchProgress, Series, SeriesProgressMap } from '../types/content.types';
import { COURSES, SERIES_DATA, EXPLORATION_CATEGORIES } from '../data/courses';

const CONTINUE_WATCHING_KEY = 'continueWatching';
const WATCH_HISTORY_KEY = 'watchHistory';
const SERIES_PROGRESS_PREFIX = 'seriesProgress_';

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

// ========== Series Recommendation Functions ==========

/**
 * Get series progress from localStorage
 */
function getSeriesProgress(seriesId: string): SeriesProgressMap {
  try {
    const saved = localStorage.getItem(`${SERIES_PROGRESS_PREFIX}${seriesId}`);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

/**
 * Save progress for a specific episode within a series
 */
export function saveSeriesEpisodeProgress(
  seriesId: string,
  episodeId: string,
  progress: number
): void {
  const current = getSeriesProgress(seriesId);
  current[episodeId] = Math.min(100, Math.max(0, progress));
  localStorage.setItem(`${SERIES_PROGRESS_PREFIX}${seriesId}`, JSON.stringify(current));
}

/**
 * Check if all episodes in a series are completed (progress >= 100)
 */
export function isSeriesCompleted(seriesId: string): boolean {
  const series = SERIES_DATA.find((s) => s.id === seriesId);
  if (!series) return false;

  const progress = getSeriesProgress(seriesId);
  return series.episodes.every((ep) => (progress[ep.id] || 0) >= 100);
}

/**
 * Get the first unfinished episode in a series (linear enforcement)
 * Returns the first episode with progress < 100, or the first episode if none started
 */
export function getFirstUnfinishedEpisode(
  seriesId: string
): { episodeId: string; episodeTitle: string; order: number } | null {
  const series = SERIES_DATA.find((s) => s.id === seriesId);
  if (!series) return null;
  if (!series.episodes || series.episodes.length === 0) return null;

  const progress = getSeriesProgress(seriesId);
  const sorted = [...series.episodes].sort((a, b) => a.order - b.order);

  const unfinished = sorted.find((ep) => (progress[ep.id] || 0) < 100);

  if (unfinished) {
    return {
      episodeId: unfinished.id,
      episodeTitle: unfinished.title,
      order: unfinished.order,
    };
  }

  // All completed, return first episode
  return {
    episodeId: sorted[0].id,
    episodeTitle: sorted[0].title,
    order: sorted[0].order,
  };
}

/**
 * Get overall progress percentage for a series
 */
export function getSeriesProgressPercent(seriesId: string): number {
  const series = SERIES_DATA.find((s) => s.id === seriesId);
  if (!series || series.episodes.length === 0) return 0;

  const progress = getSeriesProgress(seriesId);
  const totalProgress = series.episodes.reduce((sum, ep) => sum + (progress[ep.id] || 0), 0);

  return Math.round(totalProgress / series.episodes.length);
}

/**
 * Get interest-based series recommendations
 * Filters SERIES_DATA by matching interest tags, excludes completed series
 */
export async function getRecommendedSeries(interestNames: string[]): Promise<Series[]> {
  try {
    // If no interests, return first 6 series
    if (interestNames.length === 0) {
      return SERIES_DATA.filter((s) => !isSeriesCompleted(s.id)).slice(0, 6);
    }

    // Filter series where any tag matches any interest
    const interestSet = new Set(interestNames);
    const matchingSeries = SERIES_DATA.filter(
      (s) => s.tags.some((tag) => interestSet.has(tag)) && !isSeriesCompleted(s.id)
    );

    // Shuffle and return up to 8
    return shuffleArray(matchingSeries).slice(0, 8);
  } catch (error) {
    console.error('Error fetching recommended series:', error);
    return [];
  }
}
