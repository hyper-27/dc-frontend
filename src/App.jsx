// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Import your pages
import AuthPage from './pages/AuthPage';
import DecisionsPage from './pages/DecisionsPage';
import DecisionDetailPage from './pages/DecisionDetailPage';
import DecisionEditPage from './pages/DecisionEditPage';
import CreateDecisionPage from './pages/CreateDecisionPage';

import './index.css'; // Global body styles
import './styles/common.css'; // Common styles for layout and general elements

// ProtectedRoute component to ensure user is authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Apply the new 'loading-screen' class for consistent styling
    return (
      <div className="loading-screen">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        {/* Main content area - using 'app-main-content' class */}
        <main className="app-main-content">
          <Routes>
            {/* Public Route for Authentication */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes - require authentication */}
            <Route
              path="/decisions"
              element={
                <ProtectedRoute>
                  <DecisionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-decision"
              element={
                <ProtectedRoute>
                  <CreateDecisionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decisions/:id"
              element={
                <ProtectedRoute>
                  <DecisionDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decisions/:id/edit"
              element={
                <ProtectedRoute>
                  <DecisionEditPage />
                </ProtectedRoute>
              }
            />

            {/* Default Route: Redirect authenticated users to /decisions, others to /auth */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/decisions" replace />
                </ProtectedRoute>
              }
            />
            {/* Catch-all for unknown routes (redirect to decisions) */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/decisions" replace />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;