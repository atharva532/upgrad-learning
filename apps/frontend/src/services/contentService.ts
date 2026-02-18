/**
 * Content Service
 * Fetches video and series content for homepage sections.
 * Uses API for content data, localStorage for watch progress.
 */

import { Video, WatchProgress, Series, SeriesProgressMap } from '../types/content.types';
import { COURSES, SERIES_DATA, EXPLORATION_CATEGORIES } from '../data/courses';

const API_BASE = '/api';
const CONTINUE_WATCHING_KEY = 'continueWatching';
const WATCH_HISTORY_KEY = 'watchHistory';
const SERIES_PROGRESS_PREFIX = 'seriesProgress_';
const SERIES_LAST_WATCHED_PREFIX = 'seriesLastWatched_';

export interface WatchHistoryEntry {
  courseId: string;
  progress: number;
  lastWatched: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch helper with auth token
 */
async function apiFetch<T>(url: string): Promise<T | null> {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const result: ApiResponse<T> = await res.json();
    if (!result.success || !result.data) return null;
    return result.data;
  } catch {
    return null;
  }
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

    // Try to find from API first, fall back to static data
    const course = await apiFetch<Video>(`${API_BASE}/content/courses/${watchProgress.videoId}`);
    if (course) {
      return { ...course, progress: watchProgress.progress };
    }

    // Fallback to static data
    const staticCourse = COURSES.find((c) => c.id === watchProgress.videoId);
    if (!staticCourse) return null;

    return {
      ...staticCourse,
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
 * Tries API first, falls back to static data
 */
export async function getExplorationContent(): Promise<Video[]> {
  try {
    // Try API first
    const courses = await apiFetch<Video[]>(`${API_BASE}/content/courses`);
    if (courses && courses.length > 0) {
      const explorationCourses = courses.filter((c) => EXPLORATION_CATEGORIES.includes(c.category));
      return shuffleArray(explorationCourses).slice(0, 6);
    }

    // Fallback to static data
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

  // Track last-watched episode so we can resume from here
  localStorage.setItem(`${SERIES_LAST_WATCHED_PREFIX}${seriesId}`, episodeId);
}

/**
 * Check if all episodes in a series are completed (progress >= 100)
 * Accepts a Series object or seriesId (falls back to static data for ID)
 */
export function isSeriesCompleted(seriesOrId: string | Series): boolean {
  const series =
    typeof seriesOrId === 'string' ? SERIES_DATA.find((s) => s.id === seriesOrId) : seriesOrId;
  if (!series) return false;

  const progress = getSeriesProgress(series.id);
  return series.episodes.every((ep) => (progress[ep.id] || 0) >= 100);
}

/**
 * Get the first unfinished episode in a series (linear enforcement)
 * Returns the first episode with progress < 100, or the first episode if none started
 * Accepts a Series object directly so it works with API-sourced data (not just static IDs)
 */
export function getFirstUnfinishedEpisode(
  seriesOrId: string | Series
): { episodeId: string; episodeTitle: string; order: number } | null {
  const series =
    typeof seriesOrId === 'string' ? SERIES_DATA.find((s) => s.id === seriesOrId) : seriesOrId;
  if (!series) return null;
  if (!series.episodes || series.episodes.length === 0) return null;

  const progress = getSeriesProgress(series.id);
  const sorted = [...series.episodes].sort((a, b) => a.order - b.order);

  // 1. If user has a last-watched episode, resume from there (if not completed)
  const lastWatchedId = localStorage.getItem(`${SERIES_LAST_WATCHED_PREFIX}${series.id}`);
  if (lastWatchedId) {
    const lastWatched = sorted.find((ep) => ep.id === lastWatchedId);
    if (lastWatched && (progress[lastWatched.id] || 0) < 100) {
      return {
        episodeId: lastWatched.id,
        episodeTitle: lastWatched.title,
        order: lastWatched.order,
      };
    }
    // If last-watched is completed, find the next unfinished episode after it
    if (lastWatched) {
      const lastWatchedIndex = sorted.indexOf(lastWatched);
      const nextUnfinished = sorted
        .slice(lastWatchedIndex + 1)
        .find((ep) => (progress[ep.id] || 0) < 100);
      if (nextUnfinished) {
        return {
          episodeId: nextUnfinished.id,
          episodeTitle: nextUnfinished.title,
          order: nextUnfinished.order,
        };
      }
    }
  }

  // 2. Fallback: find first unfinished episode in order
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
 * Accepts a Series object or seriesId
 */
export function getSeriesProgressPercent(seriesOrId: string | Series): number {
  const series =
    typeof seriesOrId === 'string' ? SERIES_DATA.find((s) => s.id === seriesOrId) : seriesOrId;
  if (!series || series.episodes.length === 0) return 0;

  const progress = getSeriesProgress(series.id);
  const totalProgress = series.episodes.reduce((sum, ep) => sum + (progress[ep.id] || 0), 0);

  return Math.round(totalProgress / series.episodes.length);
}

/**
 * Check if the user has started watching any episode of a series
 */
export function hasSeriesProgress(seriesOrId: string | Series): boolean {
  const id = typeof seriesOrId === 'string' ? seriesOrId : seriesOrId.id;
  const progress = getSeriesProgress(id);
  return Object.values(progress).some((p) => p > 0);
}

/**
 * Get in-progress series for the Continue Watching section.
 * Returns series that have been started but not completed.
 */
export async function getContinueWatchingSeries(): Promise<Series[]> {
  try {
    // Try API first
    const allSeries = await apiFetch<Series[]>(`${API_BASE}/content/series`);
    const seriesList = allSeries && allSeries.length > 0 ? allSeries : SERIES_DATA;

    return seriesList.filter((s) => hasSeriesProgress(s) && !isSeriesCompleted(s));
  } catch {
    return SERIES_DATA.filter((s) => hasSeriesProgress(s) && !isSeriesCompleted(s));
  }
}

/**
 * Get interest-based series recommendations
 * Tries API first, falls back to static data
 */
export async function getRecommendedSeries(interestNames: string[]): Promise<Series[]> {
  try {
    // Try API first
    const allSeries = await apiFetch<Series[]>(`${API_BASE}/content/series`);
    if (allSeries && allSeries.length > 0) {
      if (interestNames.length === 0) {
        return allSeries.filter((s) => !isSeriesCompleted(s)).slice(0, 6);
      }

      const interestSet = new Set(interestNames);
      const matchingSeries = allSeries.filter(
        (s) => s.tags.some((tag) => interestSet.has(tag)) && !isSeriesCompleted(s)
      );

      return matchingSeries.slice(0, 8);
    }

    // Fallback to static data
    if (interestNames.length === 0) {
      return SERIES_DATA.filter((s) => !isSeriesCompleted(s.id)).slice(0, 6);
    }

    const interestSet = new Set(interestNames);
    const matchingSeries = SERIES_DATA.filter(
      (s) => s.tags.some((tag) => interestSet.has(tag)) && !isSeriesCompleted(s.id)
    );

    return matchingSeries.slice(0, 8);
  } catch (error) {
    console.error('Error fetching recommended series:', error);
    return [];
  }
}
