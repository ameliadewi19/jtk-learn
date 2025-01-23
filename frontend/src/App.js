import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import DashboardPelajar from './pages/DashboardPelajarPage';
import DashboardPengajar from './pages/DashboardPengajarPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarPelajar from './components/SidebarPelajar';
import SidebarPengajar from './components/SidebarPengajar';
import CoursePengajar from './pages/CoursePengajarPage';
import CourseOverviewPage from './pages/CourseOverviewPage';

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
            path="/learn-course/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SidebarPelajar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-course/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SidebarPengajar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-course"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CoursePengajar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-info-course/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CoursePengajar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CourseOverviewPage />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
    </Router>
    </UserProvider >
  );
}

export default App;
