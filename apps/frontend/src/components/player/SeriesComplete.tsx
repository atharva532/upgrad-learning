import { useNavigate } from 'react-router-dom';

interface SeriesCompleteProps {
  seriesTitle: string;
  episodeCount: number;
  onRewatch?: () => void;
}

export function SeriesComplete({ seriesTitle, episodeCount, onRewatch }: SeriesCompleteProps) {
  const navigate = useNavigate();

  return (
    <div className="series-complete">
      <div className="series-complete-icon">🎉</div>
      <h2 className="series-complete-title">Series Complete!</h2>
      <p className="series-complete-message">
        You&apos;ve finished all <strong>{episodeCount}</strong> episodes of{' '}
        <strong>{seriesTitle}</strong>.
      </p>
      <div className="series-complete-actions">
        {onRewatch && (
          <button className="btn-secondary btn-small" onClick={onRewatch}>
            Rewatch Series
          </button>
        )}
        <button className="btn-primary btn-small" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
