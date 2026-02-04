import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Home } from './components/Home';

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

          {/* Home/Dashboard - protected, requires authentication */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
