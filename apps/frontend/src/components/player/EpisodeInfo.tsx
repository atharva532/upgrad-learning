interface EpisodeInfoProps {
  seriesTitle?: string;
  episodeTitle: string;
  episodeOrder?: number;
  duration: number;
  description?: string;
  category?: string;
}

function formatDuration(seconds: number): string {
  const totalSeconds = Math.round(seconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function EpisodeInfo({
  seriesTitle,
  episodeTitle,
  episodeOrder,
  duration,
  description,
  category,
}: EpisodeInfoProps) {
  return (
    <div className="episode-info">
      {seriesTitle && <span className="episode-series-label">{seriesTitle}</span>}
      <div className="episode-title-row">
        {episodeOrder != null && <span className="episode-order-badge">EP {episodeOrder}</span>}
        <h2 className="episode-title">{episodeTitle}</h2>
      </div>
      <div className="episode-meta">
        <span className="episode-duration">⏱ {formatDuration(duration)}</span>
        {category && <span className="episode-category">{category}</span>}
      </div>
      {description && <p className="episode-description">{description}</p>}
    </div>
  );
}
