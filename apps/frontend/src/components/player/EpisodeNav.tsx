interface EpisodeNavProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  previousTitle?: string;
  nextTitle?: string;
}

export function EpisodeNav({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  previousTitle,
  nextTitle,
}: EpisodeNavProps) {
  if (!hasPrevious && !hasNext) return null;

  return (
    <div className="episode-nav">
      <button
        className="episode-nav-btn episode-nav-prev"
        onClick={onPrevious}
        disabled={!hasPrevious}
        title={previousTitle ? `Previous: ${previousTitle}` : 'Previous episode'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M11 2L5 8l6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="episode-nav-label">
          {hasPrevious ? previousTitle || 'Previous' : 'Previous'}
        </span>
      </button>

      <button
        className="episode-nav-btn episode-nav-next"
        onClick={onNext}
        disabled={!hasNext}
        title={nextTitle ? `Next: ${nextTitle}` : 'Next episode'}
      >
        <span className="episode-nav-label">{hasNext ? nextTitle || 'Next' : 'Next'}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M5 2l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
