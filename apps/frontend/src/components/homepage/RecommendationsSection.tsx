/**
 * RecommendationsSection Component
 * Interest-based series recommendations
 */

import { Series } from '../../types/content.types';
import { SeriesCard } from './SeriesCard';

interface RecommendationsSectionProps {
  series: Series[];
  isLoading: boolean;
  onSeriesClick: (seriesId: string) => void;
}

export function RecommendationsSection({
  series,
  isLoading,
  onSeriesClick,
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

  if (series.length === 0) {
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
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} onSeriesClick={onSeriesClick} />
        ))}
      </div>
    </section>
  );
}
