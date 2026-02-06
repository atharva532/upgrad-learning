import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video } from '../types/content.types';
import {
  getContinueWatching,
  getRecommendations,
  getExplorationContent,
  saveWatchProgress,
} from '../services/contentService';
import { ContinueWatching, RecommendationsSection, ExplorationSection } from './homepage';

export function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State for homepage sections
  const [continueVideo, setContinueVideo] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Video[]>([]);
  const [exploration, setExploration] = useState<Video[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [isLoadingExploration, setIsLoadingExploration] = useState(true);

  useEffect(() => {
    async function loadHomepageContent() {
      try {
        // Load continue watching
        const continueWatching = await getContinueWatching();
        setContinueVideo(continueWatching);

        // Load recommendations (would use user interests in production)
        const recs = await getRecommendations([]);
        setRecommendations(recs);
        setIsLoadingRecommendations(false);

        // Load exploration content
        const explore = await getExplorationContent();
        setExploration(explore);
        setIsLoadingExploration(false);
      } catch (error) {
        console.error('Error loading homepage content:', error);
        setIsLoadingRecommendations(false);
        setIsLoadingExploration(false);
      }
    }

    loadHomepageContent();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleResume = (videoId: string) => {
    // In production, navigate to video player
    console.log('Resuming video:', videoId);
    // Simulate progress update
    saveWatchProgress(videoId, Math.min(100, (continueVideo?.progress || 0) + 10));
  };

  const handleWatch = (videoId: string) => {
    // In production, navigate to video player
    console.log('Starting video:', videoId);
    // Simulate starting a new video
    saveWatchProgress(videoId, 5);
    // Refresh continue watching
    getContinueWatching().then(setContinueVideo);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-content">
          <div className="home-brand">
            <svg
              width="32"
              height="32"
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
            <span className="home-brand-text">LearnSphere</span>
          </div>
          <div className="home-header-actions">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="welcome-section">
          <h1 className="welcome-title">Welcome back, Learner!</h1>
          <p className="welcome-subtitle">Pick up where you left off or discover something new.</p>
        </section>

        {/* Fixed Section Order: Continue Watching → Recommendations → Exploration */}
        <ContinueWatching video={continueVideo} onResume={handleResume} />

        <RecommendationsSection
          videos={recommendations}
          isLoading={isLoadingRecommendations}
          onWatch={handleWatch}
        />

        <ExplorationSection
          videos={exploration}
          isLoading={isLoadingExploration}
          onWatch={handleWatch}
        />
      </main>
    </div>
  );
}
