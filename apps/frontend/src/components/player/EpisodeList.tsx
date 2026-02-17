import { Episode } from '../../types/content.types';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId: string;
  seriesTitle: string;
  onEpisodeClick: (episodeId: string) => void;
  getEpisodeProgress?: (episodeId: string) => number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function EpisodeList({
  episodes,
  currentEpisodeId,
  seriesTitle,
  onEpisodeClick,
  getEpisodeProgress,
}: EpisodeListProps) {
  return (
    <div className="episode-list">
      <div className="episode-list-header">
        <h3 className="episode-list-title">{seriesTitle}</h3>
        <span className="episode-list-count">{episodes.length} episodes</span>
      </div>
      <div className="episode-list-items">
        {episodes.map((ep) => {
          const isCurrent = ep.id === currentEpisodeId;
          const progress = getEpisodeProgress ? getEpisodeProgress(ep.id) : 0;

          return (
            <button
              key={ep.id}
              className={`episode-list-item ${isCurrent ? 'active' : ''}`}
              onClick={() => onEpisodeClick(ep.id)}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <div className="episode-list-item-order">
                {isCurrent ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2l10 6-10 6V2z" />
                  </svg>
                ) : (
                  <span>{ep.order}</span>
                )}
              </div>
              <div className="episode-list-item-info">
                <span className="episode-list-item-title">{ep.title}</span>
                <span className="episode-list-item-duration">{formatDuration(ep.duration)}</span>
              </div>
              {progress > 0 && progress < 100 && (
                <div className="episode-list-item-progress">
                  <div
                    className="episode-list-item-progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {progress >= 100 && <div className="episode-list-item-check">✓</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
