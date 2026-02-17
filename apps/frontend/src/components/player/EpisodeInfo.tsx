interface EpisodeInfoProps {
  seriesTitle?: string;
  episodeTitle: string;
  episodeOrder?: number;
  duration: number;
  description?: string;
  category?: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
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
        {episodeOrder && <span className="episode-order-badge">EP {episodeOrder}</span>}
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
