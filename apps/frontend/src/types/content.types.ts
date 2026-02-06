/**
 * Content Types for Homepage
 */

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  progress?: number; // 0-100 percentage
  category: string;
  description?: string;
}

export interface WatchProgress {
  videoId: string;
  progress: number; // 0-100 percentage
  lastWatched: string; // ISO date string
}
