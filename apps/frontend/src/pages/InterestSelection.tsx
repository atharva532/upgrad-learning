import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInterests, saveUserInterests, type Interest } from '../services/interestService';

export function InterestSelection() {
  const navigate = useNavigate();
  const { setOnboardingComplete } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch interests on mount
  useEffect(() => {
    async function loadInterests() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getInterests();
        setInterests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load interests');
      } finally {
        setIsLoading(false);
      }
    }

    loadInterests();
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContinue = async () => {
    if (selectedIds.size === 0) return;

    try {
      setIsSaving(true);
      setError(null);
      await saveUserInterests(Array.from(selectedIds));
      setOnboardingComplete();
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save interests');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-card">
          <div className="loading-spinner" aria-label="Loading interests"></div>
          <p className="auth-subtitle">Loading interests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <header className="onboarding-header">
          <div className="onboarding-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M24 4L2 16L24 28L42 18.18V32H46V16L24 4Z" fill="#5b5fc7" />
              <path
                d="M10 21.18V33.18L24 42L38 33.18V21.18L24 30L10 21.18Z"
                fill="#5b5fc7"
                opacity="0.8"
              />
            </svg>
          </div>
          <h1 className="onboarding-title">Choose what you want to learn</h1>
          <p className="onboarding-subtitle">
            Pick at least one interest to personalize your experience.
          </p>
        </header>

        {error && (
          <div className="form-error" role="alert">
            {error}
            <button
              className="btn-link"
              onClick={() => window.location.reload()}
              style={{ marginLeft: '0.5rem' }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="interests-grid" role="group" aria-label="Learning interests">
          {interests.map((interest) => (
            <button
              key={interest.id}
              type="button"
              className={`interest-chip ${selectedIds.has(interest.id) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest.id)}
              aria-pressed={selectedIds.has(interest.id)}
              disabled={isSaving}
            >
              <span className="interest-chip-icon">{selectedIds.has(interest.id) ? '✓' : '+'}</span>
              <span className="interest-chip-text">{interest.name}</span>
            </button>
          ))}
        </div>

        {interests.length === 0 && !error && (
          <p className="auth-subtitle" style={{ textAlign: 'center', marginTop: '2rem' }}>
            No interests available. Please try again later.
          </p>
        )}
      </div>

      <footer className="onboarding-footer">
        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={selectedIds.size === 0 || isSaving}
          aria-disabled={selectedIds.size === 0 || isSaving}
        >
          {isSaving ? (
            <>
              <span className="btn-spinner"></span>
              Saving...
            </>
          ) : (
            `Continue${selectedIds.size > 0 ? ` (${selectedIds.size} selected)` : ''}`
          )}
        </button>
        {selectedIds.size === 0 && (
          <p className="onboarding-hint">Select at least one interest to continue</p>
        )}
      </footer>
    </div>
  );
}
