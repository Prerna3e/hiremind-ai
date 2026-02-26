import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import InterviewPage from './pages/InterviewPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
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
            </Routes>
          </main>

          <footer style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
            <div className="container">
              <p style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>HireMind AI</p>
              <p>© 2026 HireMind AI. Built with precision for future leaders.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;