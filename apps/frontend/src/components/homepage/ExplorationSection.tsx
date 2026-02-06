/**
 * ExplorationSection Component
 * Content outside user's known interests for discovery
 */

import { Video } from '../../types/content.types';
import { VideoCard } from './VideoCard';

interface ExplorationSectionProps {
  videos: Video[];
  isLoading: boolean;
  onWatch: (videoId: string) => void;
}

export function ExplorationSection({ videos, isLoading, onWatch }: ExplorationSectionProps) {
  if (isLoading) {
    return (
      <section className="homepage-section exploration-section">
        <h2 className="section-title">Explore Something New</h2>
        <div className="video-grid loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="video-card-skeleton">
              <div className="skeleton-thumbnail" />
              <div className="skeleton-title" />
              <div className="skeleton-category" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="homepage-section exploration-section">
      <h2 className="section-title">Explore Something New</h2>
      <p className="section-subtitle">Discover content outside your usual topics</p>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onAction={() => onWatch(video.id)}
            actionLabel="Explore"
          />
        ))}
      </div>
    </section>
  );
}
