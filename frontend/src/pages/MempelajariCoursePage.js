import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarPelajar from "../components/SidebarPelajar";
import MelihatMateri from "../components/MelihatMateri";
import MengerjakanQuiz from "../components/MengerjakanQuiz";
import api from "../services/api";
import Swal from "sweetalert2";
import { UserContext } from "../components/UserContext";

const MempelajariCoursePage = () => {
  const [courseMateri, setCourseMateri] = useState([]);
  const [activeMateri, setActiveMateri] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const calculateCourseProgress = (currentMateriIndex, totalMateri) => {
    if (totalMateri === 0) return 0;
    const progress = ((currentMateriIndex + 1) / totalMateri) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const handleProgressUpdate = async () => {
    try {
      const currentMateriIndex = courseMateri.findIndex(
        (m) => m.id === activeMateri.id
      );
      const newProgress = calculateCourseProgress(
        currentMateriIndex,
        courseMateri.length
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

  const handleMateriChange = (materi) => {
    setActiveMateri(materi);
    setIsQuizMode(materi?.type === "quiz");
  };

  const handleMateriNext = () => {
    const currentIndex = courseMateri.findIndex(
      (m) => m.id === activeMateri.id
    );
    const nextIndex = currentIndex + 1;

    if (nextIndex < courseMateri.length) {
      setActiveMateri(courseMateri[nextIndex]);
    }
    handleProgressUpdate();
  };

  const handleQuizSubmit = (answers) => {
    console.log("Quiz submitted:", answers);

    Swal.fire("Success", "Your answers have been submitted!", "success");
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
    if (activeMateri && activeMateri.type === "quiz") {
      setIsQuizMode(true);
    }
  }, [activeMateri]);

  return (
    <div
      className="container-fluid d-flex"
      style={{
        padding: "0px",
        background: "#d9d9d9",
        height: "100vh",
      }}
    >
      <div>
        <SidebarPelajar
          onMateriChange={handleMateriChange} // mengubah materi aktif
          onLoadMateri={setCourseMateri} // mengisi daftar materi
          activeMateri={activeMateri}
          onCourseChange={handleCourseChange}
          updateCProgress={updateCProgress}
        />
      </div>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 border-main-content">
        {activeMateri ? (
          isQuizMode ? (
            <MengerjakanQuiz
              quizData={activeMateri} // Kirim data quiz aktif
              onSubmitQuiz={handleQuizSubmit} // Callback untuk submit quiz
            />
          ) : (
            <MelihatMateri
              activeMateri={activeMateri} // Kirim data materi aktif
              handleMateriNext={handleMateriNext} // Callback untuk navigasi ke materi berikutnya
            />
          )
        ) : (
          <div className="text-center">
            <h4>Silakan pilih materi atau quiz dari sidebar.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default MempelajariCoursePage;
