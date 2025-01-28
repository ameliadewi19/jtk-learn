import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarPelajar from "../components/SidebarPelajar";
import api from "../services/api";
import Swal from "sweetalert2";
import { UserContext } from "../components/UserContext";

const MempelajariCoursePage = () => {
  const [courseMateri, setCourseMateri] = useState([]);
  const [activeMateri, setActiveMateri] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
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

  const updateCProgress = (courseId, progress) => {
    setActiveCourse((prevCourse) => ({
      ...prevCourse,
      progress: progress,
    }));
  };

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
          onCourseChange={setActiveCourse}
          updateCProgress={updateCProgress}
        />
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 border-main-content">
        <div
          className="content-box position-relative p-4 w-100"
          style={{ maxWidth: "1300px" }}
        >
          {activeMateri ? (
            <>
              <h3 className="position-absolute material-title">
                {activeMateri.name}
              </h3>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: "70vh",
                }}
              >
                {activeMateri.type === "teks" ? (
                  <iframe
                    src={activeMateri.content}
                    title="PDF Viewer"
                    style={{
                      width: "90%",
                      height: "100%",
                      border: "none",
                    }}
                    onError={() =>
                      Swal.fire("Error", "File PDF doesn't exist.", "error")
                    }
                  ></iframe>
                ) : (
                  <video
                    controls
                    style={{
                      width: "90%",
                      maxWidth: "1200px",
                      height: "auto",
                      backgroundColor: "#000",
                    }}
                    title="Video Player"
                  >
                    <source src={activeMateri.content} type="video/mp4" />
                    Browser Anda tidak mendukung video.
                  </video>
                )}
              </div>

              <button
                className="btn position-absolute course-next-button d-flex align-items-center"
                onClick={handleMateriNext}
              >
                Next
                <span className="next-button">&gt;</span>
              </button>
            </>
          ) : (
            <p>Pilih materi dari sidebar untuk memulai.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MempelajariCoursePage;
