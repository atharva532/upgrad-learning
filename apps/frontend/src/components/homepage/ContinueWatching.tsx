/**
 * ContinueWatching Component
 * Shows in-progress standalone videos AND series with resume option.
 * Only renders when there's content in progress.
 */

import { Video, Series } from '../../types/content.types';
import { VideoCard } from './VideoCard';
import { getSeriesProgressPercent, getFirstUnfinishedEpisode } from '../../services/contentService';

interface ContinueWatchingProps {
  video: Video | null;
  series: Series[];
  onResume: (videoId: string) => void;
  onSeriesClick: (seriesId: string) => void;
}

export function ContinueWatching({
  video,
  series,
  onResume,
  onSeriesClick,
}: ContinueWatchingProps) {
  const hasContent = video || series.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <section className="homepage-section continue-watching-section">
      <h2 className="section-title">Continue Watching</h2>

      <div className="continue-watching-grid">
        {/* In-progress standalone video */}
        {video && (
          <div className="continue-watching-item">
            <VideoCard
              video={video}
              showProgress={true}
              onAction={() => onResume(video.id)}
              actionLabel="Resume"
            />
            <div className="continue-watching-details">
              <p className="progress-text">{video.progress}% complete</p>
            </div>
          </div>
        )}

        {/* In-progress series */}
        {series.map((s) => {
          const progressPercent = getSeriesProgressPercent(s);
          const nextEp = getFirstUnfinishedEpisode(s);

          return (
            <div
              key={s.id}
              className="continue-watching-item series-resume-card"
              onClick={() => onSeriesClick(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSeriesClick(s.id);
                }
              }}
              aria-label={`Resume ${s.title}`}
            >
              <div className="series-resume-thumbnail-container">
                <img
                  src={s.thumbnail}
                  alt={s.title}
                  className="series-resume-thumbnail"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/320x180?text=Series';
                  }}
                />
                {nextEp && (
                  <span className="series-resume-episode-badge">
                    EP {nextEp.order}/{s.episodes.length}
                  </span>
                )}
                <div className="series-progress-overlay">
                  <div className="series-progress-bar" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className="series-resume-info">
                <h3 className="series-resume-title">{s.title}</h3>
                {nextEp && (
                  <p className="series-resume-next">
                    Up next: <strong>{nextEp.episodeTitle}</strong>
                  </p>
                )}
                <div className="series-resume-meta">
                  <span className="series-category">{s.category}</span>
                  <span className="series-progress-text">{progressPercent}% complete</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
