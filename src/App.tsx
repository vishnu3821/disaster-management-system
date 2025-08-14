import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DisasterProvider } from './contexts/DisasterContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import ReportDisaster from './pages/user/ReportDisaster';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import DisasterDetails from './pages/disaster/DisasterDetails';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <DisasterProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* User Routes */}
                <Route 
                  path="user/dashboard" 
                  element={
                    <ProtectedRoute role="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="report-disaster" 
                  element={
                    <ProtectedRoute role="user">
                      <ReportDisaster />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Volunteer Routes */}
                <Route 
                  path="volunteer/dashboard" 
                  element={
                    <ProtectedRoute role="volunteer">
                      <VolunteerDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="admin/dashboard" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shared Routes */}
                <Route 
                  path="disaster/:id" 
                  element={
                    <ProtectedRoute>
                      <DisasterDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </DisasterProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;