/**
 * SeriesCard Component
 * Displays a series thumbnail, title, episode count, and overall progress
 */

import { useMemo } from 'react';
import { Series } from '../../types/content.types';
import { getSeriesProgressPercent } from '../../services/contentService';

interface SeriesCardProps {
  series: Series;
  onSeriesClick: (seriesId: string) => void;
}

function formatTotalDuration(episodes: Series['episodes']): string {
  const totalSeconds = episodes.reduce((sum, ep) => sum + ep.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function SeriesCard({ series, onSeriesClick }: SeriesCardProps) {
  const progressPercent = useMemo(() => getSeriesProgressPercent(series.id), [series.id]);

  return (
    <div
      className="series-card"
      onClick={() => onSeriesClick(series.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSeriesClick(series.id);
        }
      }}
      aria-label={`${series.title} - ${series.episodes.length} episodes`}
    >
      <div className="series-thumbnail-container">
        <img
          src={series.thumbnail}
          alt={series.title}
          className="series-thumbnail"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://via.placeholder.com/320x180?text=Series';
          }}
        />
        <span className="series-episode-badge">{series.episodes.length} episodes</span>
        <span className="series-duration-badge">{formatTotalDuration(series.episodes)}</span>
        {progressPercent > 0 && (
          <div className="series-progress-overlay">
            <div className="series-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        )}
      </div>
      <div className="series-info">
        <h3 className="series-title">{series.title}</h3>
        <p className="series-description">{series.description}</p>
        <div className="series-meta">
          <span className="series-category">{series.category}</span>
          {progressPercent > 0 && (
            <span className="series-progress-text">{progressPercent}% complete</span>
          )}
        </div>
      </div>
    </div>
  );
}
