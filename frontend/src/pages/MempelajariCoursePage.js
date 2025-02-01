import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarPelajar from "../components/SidebarPelajar";
import MelihatMateri from "../components/MelihatMateri";
import MengerjakanQuiz from "../components/MengerjakanQuiz";
import StartQuiz from "../components/StartQuiz";
import QuizResult from "../components/QuizResult";
import api from "../services/api";
import { UserContext } from "../components/UserContext";

const MempelajariCoursePage = () => {
  const [activeMateri, setActiveMateri] = useState(null);
  const [courseMateri, setCourseMateri] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [isStartQuizMode, setIsStartQuizMode] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const handleMateriChange = (materi) => {
    setActiveMateri(materi);
    setQuizCompleted(false);
    if (materi?.type === "quiz") {
      setIsStartQuizMode(true);
      setIsQuizMode(false);
    } else {
      setIsStartQuizMode(false);
      setIsQuizMode(false);
    }
  };

  const handleQuizSubmit = ({ hasil, nilai, benar }) => {
    setTotalScore(nilai);
    setCorrectAnswers(benar);
    setQuizCompleted(true);
  
    if (activeMateri.type === "quiz") {
      setCompletedQuizzes((prevQuizzes) => [...prevQuizzes, activeMateri.id_quiz]);
      localStorage.setItem(`quizCompleted_${activeMateri.id_quiz}`, JSON.stringify({ totalScore: nilai, correctAnswers: benar }));
    }
  
    setIsQuizMode(false);
  };

  const updateCProgress = (courseId, progress) => {
    setProgressMap((prevMap) => ({
      ...prevMap,
      [courseId]: progress,
    }));
  };

  const handleCourseChange = (course) => {
    setActiveCourse(course);
    setActiveMateri(null);
    setIsQuizMode(false);
  };

  useEffect(() => {
    if (activeMateri) {
      if (activeMateri.type === "quiz") {
        setIsStartQuizMode(true);
        setIsQuizMode(false);
        //jadikan comment kalau mau mengerjakan quiz lagi setelah nilainya 100, dari sini
        const savedQuizResult = localStorage.getItem(`quizCompleted_${activeMateri.id_quiz}`);
        if (savedQuizResult) {
          const { totalScore, correctAnswers } = JSON.parse(savedQuizResult);
          setTotalScore(totalScore);
          setCorrectAnswers(correctAnswers);
          setQuizCompleted(true);
          setCompletedQuizzes((prev) => [...prev, activeMateri.id_quiz]);
        }
        //jadikan comment kalau mau mengerjakan quiz lagi setelah nilainya 100, sampai sini
      } else {
        setIsStartQuizMode(false);
      }
    }
  }, [activeMateri]);   

  const calculateCourseProgress = (currentMateriIndex, totalMateri) => {
    if (totalMateri === 0) return 0;
    const progress = ((currentMateriIndex + 1) / totalMateri) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const lastNewId = courseMateri.length > 0 
    ? Math.max(...courseMateri.map(m => m.new_id)) 
    : 0;

  const updateProgress = async () => {
    try {
      const currentMateriIndex = activeMateri.new_id;

      const newProgress = calculateCourseProgress(
        currentMateriIndex,
        lastNewId
      );
      const statusPenyelesaian = newProgress === 100 ? "Completed" : "In Progress";

      await api.put(
        "/participant/progress",
        {
          id_pelajar: user.userData.id_pelajar,
          id_course: activeCourse.id,
          persentase_course: newProgress,
          status_penyelesaian: statusPenyelesaian,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (activeCourse) {
        setActiveCourse((prevCourse) => ({
          ...prevCourse,
          progress: newProgress,
        }));
      }

    } catch (error) {
      console.error("Error updating course progress:", error);
    }
  };

  const isFirstMateri = activeMateri?.new_id === 1;
  const isLastMateri = activeMateri?.new_id === activeMateri?.items?.length;

  const handleNext = () => {
    if (!activeMateri) return;
  
    const currentIndex = activeMateri.new_id;
    const nextIndex = currentIndex + 1;
    const nextMateri = nextIndex;
    console.log("nextMateri:", nextMateri);

    if (nextMateri) {
      setActiveMateri(nextMateri);
      updateProgress();
    }
  };
  
  const handlePrev = () => {
    if (!activeMateri) return;
  
    const currentIndex = activeMateri.new_id;
    const prevIndex = currentIndex - 1;
    const prevMateri = activeMateri?.items?.find((item) => item.new_id === prevIndex);
    console.log("prevMateri:", prevMateri);
    
    if (prevMateri) {
      setActiveMateri(prevMateri);
      setQuizCompleted(false);
      setIsStartQuizMode(prevMateri.type === "quiz");
      setIsQuizMode(false);
    }
  };

  useEffect(() => {
    if (activeCourse?.items?.length > 0) {
      setActiveMateri(activeCourse.items[0]);
    }
  }, [activeCourse]);

  const handleRetakeQuiz = () => {
    setIsQuizMode(true);
    setIsStartQuizMode(false);
    setQuizCompleted(false);
    setTotalScore(0);
    setCorrectAnswers(0);
    setCompletedQuizzes((prev) => prev.filter(id => id !== activeMateri.id_quiz));
  };
  
  const handleReviewAllQuestions = () => {
    setIsReviewMode(true);
    setIsStartQuizMode(false);
    setCompletedQuizzes((prev) => prev.filter(id => id !== activeMateri.id_quiz));
  };
  
  const handleBackToQuizResult = () => {
    setIsReviewMode(false);
    setIsQuizMode(false);
    setCompletedQuizzes((prev) => {
      if (!prev.includes(activeMateri.id_quiz)) {
        return [...prev, activeMateri.id_quiz];
      }
      return prev;
    });
  };
  
  const isQuizResultVisible = activeMateri?.type === "quiz" && completedQuizzes.includes(activeMateri.id_quiz) && !isQuizMode;
  
  console.log("Active Course:", activeCourse);
  console.log("Active Materi:", activeMateri);
  console.log("Course Items Length:", activeMateri?.items?.length);

  return (
    <div className="container-fluid d-flex" style={{ padding: "0px", background: "#d9d9d9", height: "100vh" }}>
      <div>
        <SidebarPelajar
          onMateriChange={handleMateriChange}
          activeMateri={activeMateri}
          onCourseChange={handleCourseChange}
          updateCProgress={updateCProgress}
        />
      </div>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 border-main-content" style={{ position: "relative" }}>
        {isQuizResultVisible ? (
          <QuizResult
            quizData={activeMateri}
            totalScore={totalScore}
            correctAnswers={correctAnswers}
            onRetakeQuiz={handleRetakeQuiz}
            onReview={handleReviewAllQuestions}  // Pass handler untuk review
          />
        ) : activeMateri ? (
          isQuizMode || isReviewMode ? (
            <MengerjakanQuiz
              quizData={activeMateri}
              onSubmitQuiz={handleQuizSubmit}
              isReviewMode={isReviewMode}  // Aktifkan mode review
              onBackToQuizResult={handleBackToQuizResult}  // Fungsi untuk kembali ke quiz result
            />
          ) : isStartQuizMode ? (
            <StartQuiz
              quizData={activeMateri}
              onStartQuiz={() => {
                setIsStartQuizMode(false);
                setIsQuizMode(true);
              }}
            />
          ) : (
            <MelihatMateri activeMateri={activeMateri} />
          )
        ) : (
          <div className="text-center">
            <h5>There are no materials or quizzes for this course yet</h5>
          </div>
        )}
        {!isQuizMode && (
          <div className="navigation-buttons">
            {!isFirstMateri && (
              <button
                className="btn course-prev-button align-items-center"
                onClick={handlePrev}
              >
                <span className="prev-button">&lt;</span> Previous
              </button>
            )}

            {!isLastMateri && (
              <button
                className="btn course-next-button align-items-center"
                onClick={handleNext}
              >
                Next <span className="next-button">&gt;</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MempelajariCoursePage;
