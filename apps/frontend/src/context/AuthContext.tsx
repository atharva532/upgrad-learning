import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  login: (accessToken: string, user: User, isNewUser?: boolean) => void;
  logout: () => Promise<void>;
  setOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
          setHasCompletedOnboarding(data.data.hasCompletedOnboarding ?? false);
          setIsLoading(false);
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
              setHasCompletedOnboarding(retryData.data.hasCompletedOnboarding ?? false);
              setIsLoading(false);
              return;
            }
          }

          // Failed to refresh, clear and show login
          localStorage.removeItem('accessToken');
          setIsLoading(false);
        }
      } catch {
        localStorage.removeItem('accessToken');
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (accessToken: string, userData: User, newUser = false) => {
    localStorage.setItem('accessToken', accessToken);
    setUser(userData);
    setIsNewUser(newUser);
    // New users haven't completed onboarding yet
    if (newUser) {
      setHasCompletedOnboarding(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continue with logout even if request fails
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsNewUser(false);
    setHasCompletedOnboarding(false);
  };

  const setOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setIsNewUser(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isNewUser,
        hasCompletedOnboarding,
        login,
        logout,
        setOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
