import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import DashboardPelajar from './pages/DashboardPelajarPage';
import DashboardPengajar from './pages/DashboardPengajarPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import SidebarPelajar from './components/SidebarPelajar';
import SidebarPengajar from './components/SidebarPengajar';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <LoginPage />
              </>
            } 
          />
          <Route
            path="/dashboard-pelajar"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <DashboardPelajar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-pengajar"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <DashboardPengajar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn-course"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SidebarPelajar/>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-course"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SidebarPengajar/>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn-course"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SidebarPelajar/>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-course"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SidebarPengajar/>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
