import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { OtpForm } from './components/OtpForm';
import { Home } from './components/Home';

type AuthState = 'loading' | 'email' | 'otp' | 'authenticated';

interface User {
  id: string;
  email: string;
}

function App() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setAuthState('email');
        return;
      }

      try {
        const response = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);

          setAuthState('authenticated');
        } else {
          // Try to refresh token
          const refreshResponse = await fetch('/api/auth/token/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('accessToken', refreshData.data.accessToken);

            // Retry session check
            const retryResponse = await fetch('/api/auth/session', {
              headers: { Authorization: `Bearer ${refreshData.data.accessToken}` },
            });

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              setUser(retryData.data.user);
              setAuthState('authenticated');
              return;
            }
          }

          // Failed to refresh, clear and show login
          localStorage.removeItem('accessToken');
          setAuthState('email');
        }
      } catch {
        localStorage.removeItem('accessToken');
        setAuthState('email');
      }
    };

    checkSession();
  }, []);

  const handleOtpSent = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setAuthState('otp');
  };

  const handleAuthSuccess = (data: { user: User; accessToken: string; isNewUser: boolean }) => {
    setUser(data.user);

    setIsNewUser(data.isNewUser);
    localStorage.setItem('accessToken', data.accessToken);
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    setUser(null);

    setIsNewUser(false);
    localStorage.removeItem('accessToken');
    setAuthState('email');
  };

  const handleBack = () => {
    setEmail('');
    setAuthState('email');
  };

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner"></div>
          <p className="auth-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  // Email input screen
  if (authState === 'email') {
    return <AuthForm onOtpSent={handleOtpSent} />;
  }

  // OTP verification screen
  if (authState === 'otp') {
    return <OtpForm email={email} onSuccess={handleAuthSuccess} onBack={handleBack} />;
  }

  // Authenticated - show home
  if (authState === 'authenticated' && user) {
    return <Home user={user} isNewUser={isNewUser} onLogout={handleLogout} />;
  }

  return null;
}

export default App;
