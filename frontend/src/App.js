import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import CourseListPage from './pages/CourseListPage';
import DashboardPelajar from './pages/DashboardPelajarPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/list-course"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CourseListPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <DashboardPelajar />
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
