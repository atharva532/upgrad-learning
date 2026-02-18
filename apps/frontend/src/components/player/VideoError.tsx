import { useNavigate } from 'react-router-dom';

interface VideoErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function VideoError({ message, onRetry }: VideoErrorProps) {
  const navigate = useNavigate();

  return (
    <div className="video-error">
      <div className="video-error-icon">⚠️</div>
      <h2 className="video-error-title">We couldn&apos;t load this video</h2>
      <p className="video-error-message">
        {message || 'Something went wrong. Please try again later.'}
      </p>
      <div className="video-error-actions">
        {onRetry && (
          <button className="btn-primary btn-small" onClick={onRetry}>
            Retry
          </button>
        )}
        <button className="btn-secondary btn-small" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
