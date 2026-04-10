import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import UsersListPage from './pages/Users/UsersListPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute'; // We'll create this next

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            {/* Use ProtectedRoute for routes that require authentication */}
            <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
            <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
            <Route path="/users" element={<ProtectedRoute component={UsersListPage} />} />
            {/* You can add a fallback route for unmatched paths */}
            <Route path="*" element={<p className="text-center mt-20 text-xl text-gray-700">Page Not Found</p>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;