import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import { QuizProvider } from "./components/QuizContext";
import { CourseProvider } from "./components/CourseContext";
import Navbar from "./components/Navbar";
import DashboardPelajar from "./pages/DashboardPelajarPage";
import DashboardPengajar from "./pages/DashboardPengajarPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MempelajariCoursePage from "./pages/MempelajariCoursePage";
import SidebarPengajar from "./components/SidebarPengajar";
import CoursePengajar from "./pages/CoursePengajarPage";
import CourseOverviewPage from "./pages/CourseOverviewPage";
import SummaryQuiz from "./pages/SummaryQuiz";
import DetailSummaryQuiz from "./pages/DetailSummaryQuiz";
import MyCoursesPage from "./pages/MyCoursesPage";
import HistoryQuiz from './pages/HistoryQuizPage';

function App() {
  return (
    <UserProvider>
      <QuizProvider>
        <CourseProvider>

          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
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
                        path="/edit-course/:id"
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
                      <Route
                        path="/summary-quiz"
                        element={
                          <ProtectedRoute allowedRoles={['pengajar']}>
                            <SummaryQuiz />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/summary-quiz/:id"
                        element={
                          <ProtectedRoute allowedRoles={['pengajar']}>
                            <DetailSummaryQuiz />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/history-quiz"
                        element={
                          <ProtectedRoute allowedRoles={['pelajar']}>
                            <HistoryQuiz />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </>
                }
              />
            </Routes>
          </Router>
        </CourseProvider>
      </QuizProvider>
    </UserProvider >
  );
}

export default App;
