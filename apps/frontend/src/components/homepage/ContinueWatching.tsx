/**
 * ContinueWatching Component
 * Shows single in-progress video with resume option
 * Only renders when there's an in-progress video
 */

import { Video } from '../../types/content.types';
import { VideoCard } from './VideoCard';

interface ContinueWatchingProps {
  video: Video | null;
  onResume: (videoId: string) => void;
}

export function ContinueWatching({ video, onResume }: ContinueWatchingProps) {
  // Don't render if no video in progress
  if (!video) {
    return null;
  }

  return (
    <section className="homepage-section continue-watching-section">
      <h2 className="section-title">Continue Watching</h2>
      <div className="continue-watching-content">
        <VideoCard
          video={video}
          showProgress={true}
          onAction={() => onResume(video.id)}
          actionLabel="Resume"
        />
        <div className="continue-watching-details">
          <p className="progress-text">{video.progress}% complete</p>
          {video.description && <p className="video-description">{video.description}</p>}
        </div>
      </div>
    </section>
  );
}
