import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import DashboardPelajar from './pages/DashboardPelajarPage';
import DashboardPengajar from './pages/DashboardPengajarPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

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
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
