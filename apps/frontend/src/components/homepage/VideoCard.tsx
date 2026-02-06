/**
 * VideoCard Component
 * Reusable card displaying video thumbnail, title, and optional progress
 */

import { Video } from '../../types/content.types';

interface VideoCardProps {
  video: Video;
  showProgress?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export function VideoCard({ video, showProgress = false, onAction, actionLabel }: VideoCardProps) {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://via.placeholder.com/320x180?text=Video';
          }}
        />
        <span className="video-duration">{formatDuration(video.duration)}</span>
        {showProgress && video.progress !== undefined && (
          <div className="video-progress-overlay">
            <div className="video-progress-bar" style={{ width: `${video.progress}%` }} />
          </div>
        )}
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <span className="video-category">{video.category}</span>
        {onAction && (
          <button onClick={onAction} className="video-action-btn">
            {actionLabel || 'Watch'}
          </button>
        )}
      </div>
    </div>
  );
}
