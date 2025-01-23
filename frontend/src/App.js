import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import DashboardPelajar from './pages/DashboardPelajarPage';
import DashboardPengajar from './pages/DashboardPengajarPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MempelajariCoursePage from './pages/MempelajariCoursePage';
import SidebarPengajar from './components/SidebarPengajar';
import CoursePengajar from './pages/CoursePengajarPage';
import CourseOverviewPage from './pages/CourseOverviewPage';
import MyCoursesPage from './pages/MyCoursesPage';

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
                  <MempelajariCoursePage />
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
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MyCoursesPage />
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
