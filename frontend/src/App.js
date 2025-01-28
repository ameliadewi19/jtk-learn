import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Navbar from "./components/Navbar";
import DashboardPelajar from "./pages/DashboardPelajarPage";
import DashboardPengajar from "./pages/DashboardPengajarPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MempelajariCoursePage from "./pages/MempelajariCoursePage";
import SidebarPelajar from './components/SidebarPelajar';
import SidebarPengajar from "./components/SidebarPengajar";
import CoursePengajar from "./pages/CoursePengajarPage";
import CourseOverviewPage from "./pages/CourseOverviewPage";
import SummaryQuiz from "./pages/SummaryQuiz";
import DetailSummaryQuiz from "./pages/DetailSummaryQuiz";
import MyCoursesPage from "./pages/MyCoursesPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="*"
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
            path="/dashboard-pelajar"
            element={
              <ProtectedRoute allowedRoles={["pelajar"]}>
                <DashboardPelajar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn-course/:id"
            element={
              <ProtectedRoute allowedRoles={['pelajar']}>
                <>
                  <Navbar />
                  <SidebarPelajar />
                  <MempelajariCoursePage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-course/:id"
            element={
              <ProtectedRoute allowedRoles={["pengajar"]}>
                <SidebarPengajar />
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
          <Route
            path="/summary-quiz"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <SummaryQuiz />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary-quiz/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <DetailSummaryQuiz />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
