import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInterests, saveUserInterests, type Interest } from '../services/interestService';

// SVG icon map for each interest
const INTEREST_ICONS: Record<string, React.ReactNode> = {
  'Python Programming': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.5 6C16.6 6 17 9.1 17 9.1V12.3H24V13.5H12.5S6 12.8 6 20S11.7 27.1 11.7 27.1H14.5V23.8S14.3 18 20.2 18H26.7S32.1 18.1 32.1 12.9V7.7S32.8 6 23.5 6ZM19.7 8.3C20.5 8.3 21.2 9 21.2 9.8C21.2 10.6 20.5 11.3 19.7 11.3C18.9 11.3 18.2 10.6 18.2 9.8C18.2 9 18.9 8.3 19.7 8.3Z"
        fill="#8B8FA3"
      />
      <path
        d="M24.5 42C31.4 42 31 38.9 31 38.9V35.7H24V34.5H35.5S42 35.2 42 28S36.3 20.9 36.3 20.9H33.5V24.2S33.7 30 27.8 30H21.3S15.9 29.9 15.9 35.1V40.3S15.2 42 24.5 42ZM28.3 39.7C27.5 39.7 26.8 39 26.8 38.2C26.8 37.4 27.5 36.7 28.3 36.7C29.1 36.7 29.8 37.4 29.8 38.2C29.8 39 29.1 39.7 28.3 39.7Z"
        fill="#8B8FA3"
      />
    </svg>
  ),
  'Data Science': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="28" width="8" height="12" rx="1" fill="#8B8FA3" />
      <rect x="20" y="18" width="8" height="22" rx="1" fill="#8B8FA3" />
      <rect x="32" y="8" width="8" height="32" rx="1" fill="#8B8FA3" />
      <path
        d="M10 26L24 14L36 8"
        stroke="#8B8FA3"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10" cy="26" r="2" fill="#8B8FA3" />
      <circle cx="24" cy="14" r="2" fill="#8B8FA3" />
      <circle cx="36" cy="8" r="2" fill="#8B8FA3" />
    </svg>
  ),
  'UI/UX Design': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke="#8B8FA3" strokeWidth="2.5" fill="none" />
      <circle cx="18" cy="20" r="4" fill="#D4A0A0" />
      <circle cx="30" cy="18" r="3" fill="#A0C4D4" />
      <circle cx="26" cy="30" r="5" fill="#A0D4A0" />
      <circle cx="16" cy="30" r="2.5" fill="#D4D4A0" />
    </svg>
  ),
  'Digital Marketing': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 10L36 34L24 28V16L36 10Z" fill="#8B8FA3" />
      <rect x="12" y="16" width="12" height="12" rx="1" fill="#8B8FA3" />
      <path d="M16 28V38" stroke="#8B8FA3" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 28V36" stroke="#8B8FA3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  'Cloud Computing': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M38 28C40.2 28 42 26.2 42 24C42 21.8 40.2 20 38 20H37.2C37.1 15.6 33.5 12 29 12C26.2 12 23.7 13.5 22.3 15.7C21.5 15.3 20.6 15 19.5 15C16.5 15 14 17.5 14 20.5C14 20.7 14 20.9 14 21.1C11.2 21.7 9 24.1 9 27C9 30.3 11.7 33 15 33H38C40.2 33 42 31.2 42 29"
        stroke="#8B8FA3"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="18" y="36" width="4" height="2" rx="1" fill="#8B8FA3" />
      <rect x="25" y="36" width="4" height="2" rx="1" fill="#8B8FA3" />
      <rect x="18" y="40" width="11" height="2" rx="1" fill="#8B8FA3" />
    </svg>
  ),
  Cybersecurity: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 6L10 12V22C10 32.5 16 39.5 24 42C32 39.5 38 32.5 38 22V12L24 6Z"
        stroke="#8B8FA3"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M24 6L10 12V22C10 32.5 16 39.5 24 42V6Z" fill="#8B8FA3" opacity="0.15" />
      <path
        d="M20 24L23 27L28 20"
        stroke="#8B8FA3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'React Framework': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="3.5" fill="#8B8FA3" />
      <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#8B8FA3" strokeWidth="2" fill="none" />
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="7"
        stroke="#8B8FA3"
        strokeWidth="2"
        fill="none"
        transform="rotate(60 24 24)"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="7"
        stroke="#8B8FA3"
        strokeWidth="2"
        fill="none"
        transform="rotate(120 24 24)"
      />
    </svg>
  ),
  'Personal Finance': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="34" rx="14" ry="4" stroke="#8B8FA3" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="28" rx="14" ry="4" stroke="#8B8FA3" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="22" rx="14" ry="4" stroke="#8B8FA3" strokeWidth="2" fill="none" />
      <ellipse
        cx="24"
        cy="16"
        rx="14"
        ry="4"
        stroke="#8B8FA3"
        strokeWidth="2"
        fill="#8B8FA3"
        opacity="0.15"
      />
      <ellipse cx="24" cy="16" rx="14" ry="4" stroke="#8B8FA3" strokeWidth="2" fill="none" />
    </svg>
  ),
};

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
          <h1 className="onboarding-title">What do you want to learn?</h1>
          <p className="onboarding-subtitle">
            Select one or more topics to personalize your home feed.
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

        <div className="interest-cards-grid" role="group" aria-label="Learning interests">
          {interests.map((interest) => {
            const isSelected = selectedIds.has(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                className={`interest-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest.id)}
                aria-pressed={isSelected}
                disabled={isSaving}
              >
                <span className={`interest-card-radio ${isSelected ? 'checked' : ''}`}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="5" fill="#5b5fc7" />
                    </svg>
                  )}
                </span>
                <span className="interest-card-icon">
                  {INTEREST_ICONS[interest.name] || (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle
                        cx="24"
                        cy="24"
                        r="16"
                        stroke="#8B8FA3"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <text
                        x="24"
                        y="29"
                        textAnchor="middle"
                        fill="#8B8FA3"
                        fontSize="16"
                        fontWeight="600"
                      >
                        ?
                      </text>
                    </svg>
                  )}
                </span>
                <span className="interest-card-name">{interest.name}</span>
              </button>
            );
          })}
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
            'Continue'
          )}
        </button>
        {selectedIds.size === 0 && (
          <p className="onboarding-hint">Select at least one interest to continue</p>
        )}
      </footer>
    </div>
  );
}
