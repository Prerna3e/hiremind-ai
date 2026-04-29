import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import InterviewPage from './pages/InterviewPage';
import ResumeAnalysis from './pages/ResumeAnalysis';
import HRQuestions from './pages/HRQuestions';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isFuturisticPage = location.pathname === '/dashboard' || location.pathname === '/interview' || location.pathname === '/resume' || location.pathname === '/hr';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isFuturisticPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr"
            element={
              <ProtectedRoute>
                <HRQuestions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isFuturisticPage && (
        <footer style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', marginTop: 'auto', background: 'var(--bg-primary)' }}>
          <div className="container">
            <p style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: '700', color: 'white', fontFamily: 'var(--font-futuristic)' }}>HIREMIND AI</p>
            <p>© 2026 HireMind AI. Neural Interface v2.0. Built for the future.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;