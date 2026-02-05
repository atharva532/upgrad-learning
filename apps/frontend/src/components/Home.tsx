import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { user, isNewUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
          <button onClick={handleLogout} className="btn-secondary btn-small">
            Logout
          </button>
        </div>
      </header>

      <main className="home-main">
        <section className="welcome-section">
          <h1 className="welcome-title">
            {isNewUser ? 'Welcome to LearnSphere!' : 'Welcome back, Learner!'}
          </h1>
          <p className="welcome-subtitle">
            {isNewUser
              ? 'Your account has been created. Start exploring our courses!'
              : `Signed in as ${user.email}`}
          </p>
        </section>

        <section className="courses-section">
          <h2 className="section-title">Continue Learning</h2>
          <div className="courses-grid">
            {/* Placeholder course cards */}
            <div className="course-card">
              <div className="course-thumbnail placeholder"></div>
              <div className="course-info">
                <h3 className="course-title">Introduction to Web Development</h3>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="progress-text">65% complete</span>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-thumbnail placeholder"></div>
              <div className="course-info">
                <h3 className="course-title">React Fundamentals</h3>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '30%' }}></div>
                  </div>
                  <span className="progress-text">30% complete</span>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-thumbnail placeholder"></div>
              <div className="course-info">
                <h3 className="course-title">TypeScript Essentials</h3>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '10%' }}></div>
                  </div>
                  <span className="progress-text">10% complete</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
