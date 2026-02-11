/**
 * RecommendationsSection Component
 * Interest-based video recommendations
 */

import { Video } from '../../types/content.types';
import { VideoCard } from './VideoCard';

interface RecommendationsSectionProps {
  videos: Video[];
  isLoading: boolean;
  onWatch: (videoId: string) => void;
}

export function RecommendationsSection({
  videos,
  isLoading,
  onWatch,
}: RecommendationsSectionProps) {
  if (isLoading) {
    return (
      <section className="homepage-section recommendations-section">
        <h2 className="section-title">Recommended for You</h2>
        <div className="video-grid loading">
          {[...Array(4)].map((_, i) => (
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
    return (
      <section className="homepage-section recommendations-section">
        <h2 className="section-title">Recommended for You</h2>
        <p className="empty-state">No recommendations available yet. Start exploring!</p>
      </section>
    );
  }

  return (
    <section className="homepage-section recommendations-section">
      <h2 className="section-title">Recommended for You</h2>
      <p className="section-subtitle">Based on your interests</p>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onAction={() => onWatch(video.id)}
            actionLabel="Watch"
          />
        ))}
      </div>
    </section>
  );
}
