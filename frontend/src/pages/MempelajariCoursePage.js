import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarPelajar from "../components/SidebarPelajar";
import MelihatMateri from "../components/MelihatMateri";
import MengerjakanQuiz from "../components/MengerjakanQuiz";
import StartQuiz from "../components/StartQuiz";
import QuizResult from "../components/QuizResult";
import api from "../services/api";
import { UserContext } from "../components/UserContext";
import { useCourse } from '../components/CourseContext';

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
  const { combinedData } = useCourse();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const handleMateriChange = (materi) => {
    setActiveMateri(materi);
    setQuizCompleted(false);
    setIsReviewMode(false);
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
      updateProgress();
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
        //jadikan comment kalau mau retake quiz setelah nilainya 100, dari sini
        const savedQuizResult = localStorage.getItem(`quizCompleted_${activeMateri.id_quiz}`);
        if (savedQuizResult) {
          const { totalScore, correctAnswers } = JSON.parse(savedQuizResult);
          setTotalScore(totalScore);
          setCorrectAnswers(correctAnswers);
          setQuizCompleted(true);
          setCompletedQuizzes((prev) => [...prev, activeMateri.id_quiz]);
        }
        //jadikan comment kalau mau retake quiz setelah nilainya 100, sampai sini
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

  
  const updateProgress = async () => {
    try {
      const lastNewId = combinedData?.length;
      const currentMateriIndex = combinedData.findIndex(item => item.new_id === activeMateri.new_id);

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
          headers: {Authorization: `Bearer ${token}`,},
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
  const isLastMateri = activeMateri?.new_id === combinedData?.length;

  const handleNext = () => {
    if (!activeMateri || !combinedData) return;
  
    const currentIndex = combinedData.findIndex(item => item.new_id === activeMateri.new_id);
    if (currentIndex === -1 || currentIndex === combinedData.length - 1) return;
  
    const nextMateri = combinedData[currentIndex + 1];
    if (nextMateri) {
      if (activeMateri.type !== "quiz") {
        updateProgress();
      }
      setActiveMateri(nextMateri);
      localStorage.setItem(`lastOpenedItem-${activeCourse?.id}`, nextMateri.new_id);
    }
  };
  
  const handlePrev = () => {
    if (!activeMateri || !combinedData) return;
  
    const currentIndex = combinedData.findIndex(item => item.new_id === activeMateri.new_id);
    if (currentIndex <= 0) return; // Cegah error jika indeks pertama atau tidak ditemukan
  
    const prevMateri = combinedData[currentIndex - 1];
    if (prevMateri) {
      setActiveMateri(prevMateri);
      localStorage.setItem(`lastOpenedItem-${activeCourse?.id}`, prevMateri.new_id);
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

  useEffect(() => {
    if (activeCourse && combinedData.length > 0) {
      const lastOpenedItem = localStorage.getItem(`lastOpenedItem-${activeCourse.id}`);
      const foundItem = combinedData.find(item => item.new_id === Number(lastOpenedItem));
  
      if (foundItem) {
        setActiveMateri(foundItem);
      } else {
        setActiveMateri(combinedData[0]);
      }
    }
  }, [activeCourse, combinedData]);  

  useEffect(() => {
    if (activeMateri) {
      localStorage.setItem(`lastOpenedItem-${activeCourse?.id}`, activeMateri.new_id);
    }
  }, [activeMateri, activeCourse]);  

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
    if (activeMateri?.type === "quiz") {
      setQuizCompleted(true);
    }
  };
  
  const isQuizResultVisible = activeMateri?.type === "quiz" && completedQuizzes.includes(activeMateri.id_quiz) && !isQuizMode;

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
            onReview={handleReviewAllQuestions}
          />
        ) : activeMateri ? (
          isQuizMode || isReviewMode ? (
            <MengerjakanQuiz
              quizData={activeMateri}
              onSubmitQuiz={handleQuizSubmit}
              isReviewMode={isReviewMode}  // mode review
              onBackToQuizResult={handleBackToQuizResult}
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
        {!isQuizMode && !isReviewMode && (
          <div className={`navigation-buttons ${!isFirstMateri ? "has-prev" : "only-next"}`}>
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
