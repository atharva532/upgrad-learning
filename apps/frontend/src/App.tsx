import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import { OnboardingRoute } from './components/routes/OnboardingRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { InterestSelection } from './pages/InterestSelection';
import { Home } from './components/Home';
import { PlayerPage } from './pages/PlayerPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page - public, accessible to all */}
          <Route path="/" element={<Landing />} />

          {/* Login page - redirect to home if already authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute redirectAuthenticated>
                <Login />
              </PublicRoute>
            }
          />

          {/* Onboarding - interest selection */}
          <Route
            path="/onboarding/interests"
            element={
              <OnboardingRoute>
                <InterestSelection />
              </OnboardingRoute>
            }
          />

          {/* Home/Dashboard - protected, requires authentication + completed onboarding */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Video Player - standalone course */}
          <Route
            path="/watch/:videoId"
            element={
              <ProtectedRoute>
                <PlayerPage />
              </ProtectedRoute>
            }
          />

          {/* Video Player - series episode */}
          <Route
            path="/series/:seriesId/episode/:episodeId"
            element={
              <ProtectedRoute>
                <PlayerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
