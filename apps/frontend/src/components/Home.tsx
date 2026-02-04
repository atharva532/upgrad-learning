interface HomeProps {
  user: {
    id: string;
    email: string;
  };
  isNewUser: boolean;
  onLogout: () => void;
}

export function Home({ user, isNewUser, onLogout }: HomeProps) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continue with logout even if request fails
    }
    onLogout();
  };

  return (
    <div className="auth-container">
      <div className="auth-card home-card">
        <div className="welcome-header">
          <span className="welcome-emoji">🎓</span>
          <h1 className="auth-title">
            {isNewUser ? 'Welcome to UpGrad Learning!' : 'Welcome Back!'}
          </h1>
          <p className="auth-subtitle">You&apos;re logged in as {user.email}</p>
        </div>

        <div className="home-content">
          <p className="home-message">
            {isNewUser
              ? 'Your account has been created. Start exploring our courses!'
              : 'Ready to continue your learning journey?'}
          </p>
        </div>

        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
}
