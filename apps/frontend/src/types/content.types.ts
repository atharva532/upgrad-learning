/**
 * Content Types for Homepage & Player
 */

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  progress?: number; // 0-100 percentage
  category: string;
  description?: string;
  videoUrl: string; // direct MP4 URL
}

export interface WatchProgress {
  videoId: string;
  progress: number; // 0-100 percentage
  lastWatched: string; // ISO date string
}

export interface Episode {
  id: string;
  title: string;
  duration: number; // in seconds
  order: number; // 1-indexed position within series
  videoUrl: string; // direct MP4 URL
  seriesId: string;
}

export interface Series {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  tags: string[]; // interest names for filtering (e.g., ["React Framework", "Python Programming"])
  episodes: Episode[];
  category: string;
}

export interface SeriesProgressMap {
  [episodeId: string]: number; // episode progress 0-100
}
