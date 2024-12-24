import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CourseListPage from './pages/CourseListPage';
import DashboardPelajar from './pages/DashboardPelajarPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
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
    </Router>
  );
}

export default App;