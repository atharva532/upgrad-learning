import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VideoPlayer,
  EpisodeInfo,
  EpisodeNav,
  EpisodeList,
  SeriesComplete,
  VideoError,
} from '../components/player';
import { Video, Series, Episode } from '../types/content.types';
import { saveWatchProgress, saveSeriesEpisodeProgress } from '../services/contentService';

const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiFetch<T>(url: string): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const contentType = res.headers.get('Content-Type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  let result: ApiResponse<T>;
  try {
    result = await res.json();
  } catch {
    throw new Error(`Failed to parse JSON response from ${url}`);
  }

  if (!result.success || !result.data) {
    throw new Error(result.error || 'API request failed');
  }
  return result.data;
}

export function PlayerPage() {
  const { videoId, seriesId, episodeId } = useParams<{
    videoId?: string;
    seriesId?: string;
    episodeId?: string;
  }>();
  const navigate = useNavigate();

  // Derive mode from URL params (not useState — so it updates on re-render)
  const mode = seriesId ? 'series' : 'course';

  const [course, setCourse] = useState<Video | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Effect 1: Fetch series/course data (does NOT depend on episodeId)
  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setError(null);
      setShowComplete(false);

      try {
        if (mode === 'course' && videoId) {
          const data = await apiFetch<Video>(`${API_BASE}/content/courses/${videoId}`);
          setCourse(data);
        } else if (mode === 'series' && seriesId) {
          const seriesData = await apiFetch<Series>(`${API_BASE}/content/series/${seriesId}`);
          setSeries(seriesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [mode, videoId, seriesId, retryCount]);

  // Effect 2: Resolve current episode from already-fetched series (no network call)
  useEffect(() => {
    if (!series) return;

    const ep = series.episodes.find((e) => e.id === episodeId);
    if (ep) {
      setCurrentEpisode(ep);
    } else if (series.episodes.length > 0) {
      // Default to first episode if episodeId not found
      const firstEp = series.episodes[0];
      setCurrentEpisode(firstEp);
      navigate(`/series/${seriesId}/episode/${firstEp.id}`, { replace: true });
    }
  }, [series, episodeId, seriesId, navigate]);

  // Handle time update for progress tracking
  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      if (duration <= 0) return;
      const percent = Math.round((currentTime / duration) * 100);

      if (mode === 'course' && videoId) {
        saveWatchProgress(videoId, percent);
      } else if (mode === 'series' && seriesId && currentEpisode) {
        saveSeriesEpisodeProgress(seriesId, currentEpisode.id, percent);
      }
    },
    [mode, videoId, seriesId, currentEpisode]
  );

  // Handle video ended
  const handleEnded = useCallback(() => {
    if (mode === 'course' && videoId) {
      saveWatchProgress(videoId, 100);
    } else if (mode === 'series' && seriesId && currentEpisode && series) {
      saveSeriesEpisodeProgress(seriesId, currentEpisode.id, 100);

      // Check if there's a next episode
      const currentIndex = series.episodes.findIndex((e) => e.id === currentEpisode.id);
      if (currentIndex < series.episodes.length - 1) {
        const nextEp = series.episodes[currentIndex + 1];
        navigate(`/series/${seriesId}/episode/${nextEp.id}`);
      } else {
        setShowComplete(true);
      }
    }
  }, [mode, videoId, seriesId, currentEpisode, series, navigate]);

  // Navigation helpers
  const currentIndex = series?.episodes.findIndex((e) => e.id === currentEpisode?.id) ?? -1;
  const prevEpisode = series && currentIndex > 0 ? series.episodes[currentIndex - 1] : null;
  const nextEpisode =
    series && currentIndex < (series?.episodes.length ?? 0) - 1
      ? series.episodes[currentIndex + 1]
      : null;

  const handlePrevious = () => {
    if (prevEpisode && seriesId) {
      navigate(`/series/${seriesId}/episode/${prevEpisode.id}`);
    }
  };

  const handleNext = () => {
    if (nextEpisode && seriesId) {
      navigate(`/series/${seriesId}/episode/${nextEpisode.id}`);
    }
  };

  const handleEpisodeClick = (epId: string) => {
    if (seriesId) {
      navigate(`/series/${seriesId}/episode/${epId}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount((c) => c + 1);
  };

  const handleRewatch = () => {
    if (series && seriesId && series.episodes.length > 0) {
      setShowComplete(false);
      navigate(`/series/${seriesId}/episode/${series.episodes[0].id}`);
    }
  };

  // Shared header for all states so users can always navigate back
  const pageHeader = (
    <header className="player-header">
      <button className="player-back-btn" onClick={() => navigate('/home')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M13 4L7 10l6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Back to Home</span>
      </button>
    </header>
  );

  // Error state
  if (error) {
    return (
      <div className="player-page">
        {pageHeader}
        <div className="player-page-content">
          <VideoError message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="player-page">
        {pageHeader}
        <div className="player-page-content">
          <div className="player-loading">
            <div className="loading-spinner" />
            <p>Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  // Series complete state
  if (showComplete && series) {
    return (
      <div className="player-page">
        {pageHeader}
        <div className="player-page-content">
          <SeriesComplete
            seriesTitle={series.title}
            episodeCount={series.episodes.length}
            onRewatch={handleRewatch}
          />
        </div>
      </div>
    );
  }

  // Determine video URL and metadata
  const activeVideoUrl = mode === 'course' ? course?.videoUrl : currentEpisode?.videoUrl;
  const activeTitle = mode === 'course' ? course?.title || '' : currentEpisode?.title || '';
  const activeDuration = mode === 'course' ? course?.duration || 0 : currentEpisode?.duration || 0;
  const activeDescription = mode === 'course' ? course?.description : series?.description;
  const activeCategory = mode === 'course' ? course?.category : series?.category;

  if (!activeVideoUrl) {
    return (
      <div className="player-page">
        {pageHeader}
        <div className="player-page-content">
          <VideoError message="No video URL available" onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="player-page">
      {pageHeader}

      <div className="player-page-content">
        <div className={`player-layout ${mode === 'series' ? 'has-sidebar' : ''}`}>
          {/* Main player area */}
          <div className="player-main">
            <VideoPlayer
              key={activeVideoUrl}
              videoUrl={activeVideoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={(msg) => setError(msg)}
            />

            <div className="player-details">
              <EpisodeInfo
                seriesTitle={mode === 'series' ? series?.title : undefined}
                episodeTitle={activeTitle}
                episodeOrder={mode === 'series' ? currentEpisode?.order : undefined}
                duration={activeDuration}
                description={activeDescription}
                category={activeCategory}
              />

              {mode === 'series' && (
                <EpisodeNav
                  hasPrevious={!!prevEpisode}
                  hasNext={!!nextEpisode}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  previousTitle={prevEpisode?.title}
                  nextTitle={nextEpisode?.title}
                />
              )}
            </div>
          </div>

          {/* Episode list sidebar for series */}
          {mode === 'series' && series && currentEpisode && (
            <aside className="player-sidebar">
              <EpisodeList
                episodes={series.episodes}
                currentEpisodeId={currentEpisode.id}
                seriesTitle={series.title}
                onEpisodeClick={handleEpisodeClick}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
