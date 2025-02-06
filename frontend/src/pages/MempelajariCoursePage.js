import React, { useState, useEffect, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarPelajar from "../components/SidebarPelajar";
import MelihatMateri from "../components/MelihatMateri";
import MengerjakanQuiz from "../components/MengerjakanQuiz";
import StartQuiz from "../components/StartQuiz";
import QuizResult from "../components/QuizResult";
import api from "../services/api";
import { UserContext } from "../components/UserContext";
import { useCourse } from "../components/CourseContext";
import { flushSync } from "react-dom";
// import { useLocation } from "react-router-dom";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const MempelajariCoursePage = () => {
  const [activeMateri, setActiveMateri] = useState(null);
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
  const navigate = useNavigate();
  const [isRetake, setRetakle] = useState(false);
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const id_quiz = searchParams.get("id_quiz"); // Get id_quiz from the query string
  const mode = searchParams.get("mode");
  // const {id} = useParams();

  const sidebarRef = useRef(null);

  const refreshParticipants = () => {
    if (sidebarRef.current) {
      sidebarRef.current.refreshParticipants();
    }
  };

  // baru
  useEffect(() => {
    if (id) {
      console.log("combined data", combinedData);
      const quizData = combinedData.find((q) => q.id_quiz === Number(id));
      if (quizData) {
        setIsQuizMode(mode === "retake");
        setIsReviewMode(mode === "review");
      }
    }
  }, [id, mode, combinedData]);

  const handleMateriChange = (materi) => {
    // Reset semua state yang bisa mempengaruhi tampilan quiz/result
    setActiveMateri(materi); // Reset sebelum diubah ke materi baru
    setIsReviewMode(false);
    setIsQuizMode(false);
    setIsStartQuizMode(false);
    setQuizCompleted(false);

    // flushSync(() => {
    //     setActiveMateri(materi);
    // });

    // navigate(/learn-course/${id}, {replace: true});

    if (materi?.type === "quiz") {
      setIsStartQuizMode(true);
    }
  };

  const handleQuizSubmit = ({ hasil, nilai, benar, totalSoal }) => {
    setTotalScore(nilai);
    setCorrectAnswers(benar);
    setQuizCompleted(true);

    console.log(combinedData);

    if (activeMateri.type === "quiz") {
      setCompletedQuizzes((prevQuizzes) => [
        ...prevQuizzes,
        activeMateri.id_quiz,
      ]);
      localStorage.setItem(
        `quizCompleted_${activeMateri.id_quiz}`,
        JSON.stringify({ totalScore: nilai, correctAnswers: benar })
      );
    }

    setIsQuizMode(false);

    // *Hitung progres berdasarkan jumlah materi dalam kursus*
    if (activeCourse && combinedData) {
      const totalMateri = combinedData.length; // Total materi dalam kursus (termasuk kuis)
      const persentasePerMateri = 100 / totalMateri; // Setiap materi menyumbang sekian persen dari total kursus
      const increment = persentasePerMateri;
      const newProgress = Math.min(activeCourse.progress + increment, 100);
      if (!isRetake) {
        updateProgress(newProgress);
        setRetakle(false)
      }
    }
  };

  const updateCProgress = (courseId, progress) => {
    setProgressMap((prevMap) => ({
      ...prevMap,
      [courseId]: progress,
    }));
  };

  const handleCourseChange = (course) => {
    try {
      setActiveCourse(course);
      setActiveMateri(null);
      setIsQuizMode(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (activeMateri) {
      if (activeMateri.type === "quiz") {
        setIsStartQuizMode(true);
        setIsQuizMode(false);
        //jadikan comment kalau mau retake quiz setelah nilainya 100, dari sini
        const savedQuizResult = localStorage.getItem(
          `quizCompleted_${activeMateri.id_quiz}`
        );
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

  const calculateCourseProgress = (currentIndex, totalMateri) => {
    if (totalMateri === 0) return 0;
    const progress = ((currentIndex + 1) / totalMateri) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const updateProgress = async (newProgress) => {
    try {
      const statusPenyelesaian =
        newProgress === 100 ? "Completed" : "In Progress";

      await api.put(
        "/participant/progress",
        {
          id_pelajar: user.userData.id_pelajar,
          id_course: activeCourse.id,
          persentase_course: newProgress,
          status_penyelesaian: statusPenyelesaian,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update semua state terkait progress
      setActiveCourse((prev) => ({ ...prev, progress: newProgress }));
      updateCProgress(activeCourse.id, newProgress);
      refreshParticipants();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const isFirstMateri = activeMateri?.new_id === 1;
  const isLastMateri = activeMateri?.new_id === combinedData?.length;

  const handleNext = () => {
    if (!activeMateri || !combinedData) return;

    const currentIndex = combinedData.findIndex(
      (item) => item.new_id === activeMateri.new_id
    );

    if (currentIndex === -1 || currentIndex === combinedData.length - 1) return;

    const nextMateri = combinedData[currentIndex + 1];

    if (nextMateri) {
      // Pindah ke materi berikutnya terlebih dahulu
      setActiveMateri(nextMateri);
      localStorage.setItem(
        `lastOpenedItem-${activeCourse?.id}`,
        nextMateri.new_id
      );

      // Hitung progress berdasarkan materi yang baru
      const newIndex = currentIndex + 1;
      const totalMateri = combinedData.length;
      const newProgress = calculateCourseProgress(newIndex, totalMateri);

      if (nextMateri.type != "quiz") {
        //  jika bukan quiz maka update progres
        // Update progress ke state dan API
        updateProgress(newProgress);
      }
    }
  };

  const handlePrev = () => {
    if (!activeMateri || !combinedData) return;

    const currentIndex = combinedData.findIndex(
      (item) => item.new_id === activeMateri.new_id
    );
    if (currentIndex <= 0) return; // Cegah error jika indeks pertama atau tidak ditemukan

    const prevMateri = combinedData[currentIndex - 1];
    if (prevMateri) {
      setActiveMateri(prevMateri);
      localStorage.setItem(
        `lastOpenedItem-${activeCourse?.id}`,
        prevMateri.new_id
      );
      setQuizCompleted(false);
      setIsStartQuizMode(prevMateri.type === "quiz");
      setIsQuizMode(false);
    }
  };

  // openedok
  useEffect(() => {
    if (id_quiz) {
      const quizData = combinedData.find((q) => q.id_quiz === Number(id_quiz));
      if (quizData) {
        setIsQuizMode(mode === "retake");
        setIsReviewMode(mode === "review");
        setActiveMateri(quizData);
      }
    } else {
      if (activeCourse && combinedData.length > 0) {
        const lastOpenedItem = localStorage.getItem(
          `lastOpenedItem-${activeCourse.id}`
        );
        const foundItem = combinedData.find(
          (item) => item.new_id === Number(lastOpenedItem)
        );

        if (foundItem) {
          setActiveMateri(foundItem);
        } else {
          setActiveMateri(combinedData[0]);
        }
      }
    }
  }, [activeCourse, combinedData]);

  useEffect(() => {
    if (activeMateri) {
      localStorage.setItem(
        `lastOpenedItem-${activeCourse?.id}`,
        activeMateri.new_id
      );
    }
  }, [activeMateri, activeCourse]);

  const fetchDetailHistQuizByIDP = async () => {
    try {
      const response = await api.get(
        `/detail-history-quiz/${user.userData.id_pelajar}/${activeMateri.id_quiz}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const completedData = response.data || [];
      if (completedData.length > 0) {
        const { nilai, history_quiz } = completedData[0];
        const correct = history_quiz[0].correct_count;
        setTotalScore(nilai);
        setCorrectAnswers(correct);
      }
      console.log("berhasil fetchDetailHistQuizByIDP:", completedData);
      setCompletedQuizzes(completedData.map((quiz) => quiz.id_quiz));
    } catch (error) {
      console.error("Error fetching detailhistoryquiz:", error);
    }
  };

  useEffect(() => {
    if (activeMateri && activeMateri.id_quiz) {
      fetchDetailHistQuizByIDP();
    }
  }, [activeMateri, user, token]);

  const handleRetakeQuiz = () => {
    navigate(`/learn-course/${id}?mode=retake`);
    setIsQuizMode(true);
    setIsStartQuizMode(false);
    setQuizCompleted(false);
    setTotalScore(0);
    setRetakle(true);
    setCorrectAnswers(0);
    setCompletedQuizzes((prev) =>
      prev.filter((id) => id !== activeMateri.id_quiz)
    );
  };

  const handleReviewAllQuestions = () => {
    navigate(`/learn-course/${id}?mode=review`);
    setIsReviewMode(true);
    setIsQuizMode(false);
    setIsStartQuizMode(false);
    setCompletedQuizzes((prev) =>
      prev.filter((id) => id !== activeMateri.id_quiz)
    );
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
    setQuizCompleted(true);
    // if (activeMateri?.type === "quiz") {
    // }
  };

  const isQuizResultVisible =
    activeMateri?.type === "quiz" &&
    completedQuizzes.includes(activeMateri.id_quiz) &&
    !isQuizMode &&
    !isReviewMode;
  const isStartQuizVisible =
    activeMateri?.type === "quiz" &&
    !completedQuizzes.includes(activeMateri.id_quiz) &&
    !isQuizMode;

  return (
    <div
      className="container-fluid d-flex"
      style={{ padding: "0px", background: "#d9d9d9", height: "100vh" }}
    >
      <div>
        <SidebarPelajar
          onMateriChange={handleMateriChange}
          activeMateri={activeMateri}
          onCourseChange={handleCourseChange}
          ref={sidebarRef}
        />
      </div>
      <div
        className="flex-grow-1 d-flex align-items-center justify-content-center p-4 border-main-content"
        style={{ position: "relative" }}
      >
        {isQuizResultVisible ? (
          <QuizResult
            quizData={activeMateri}
            totalScore={totalScore}
            correctAnswers={correctAnswers}
            handleRetakeQuiz={handleRetakeQuiz}
            handleReview={handleReviewAllQuestions}
          />
        ) : activeMateri ? (
          isQuizMode || isReviewMode ? (
            <MengerjakanQuiz
              quizData={activeMateri}
              onSubmitQuiz={handleQuizSubmit}
              isReviewMode={isReviewMode}
              onBackToQuizResult={handleBackToQuizResult}
              updateProgres={updateProgress}
            />
          ) : isStartQuizVisible ? (
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
          <div
            className={`navigation-buttons ${
              !isFirstMateri ? "has-prev" : "only-next"
            }`}
          >
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