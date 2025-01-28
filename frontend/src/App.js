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
            element={<LoginPage />}
          />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route
                    path="/dashboard-pelajar"
                    element={
                      <ProtectedRoute allowedRoles={['pelajar']}>
                        <DashboardPelajar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learn-course/:id"
                    element={
                      <ProtectedRoute allowedRoles={['pelajar']}>
                        <MempelajariCoursePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/course/:id"
                    element={
                      <ProtectedRoute allowedRoles={['pelajar', 'pengajar']}>
                        <CourseOverviewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard-pengajar"
                    element={
                      <ProtectedRoute allowedRoles={['pengajar']}>
                        <DashboardPengajar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-course"
                    element={
                      <ProtectedRoute allowedRoles={['pengajar']}>
                        <SidebarPengajar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-course"
                    element={
                      <ProtectedRoute allowedRoles={['pengajar']}>
                        <CoursePengajar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-info-course/:id"
                    element={
                      <ProtectedRoute allowedRoles={['pengajar']}>
                        <CoursePengajar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-courses"
                    element={
                      <ProtectedRoute allowedRoles={['pelajar']}>
                        <MyCoursesPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
