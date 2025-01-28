import React, { useState, useEffect, useRef, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { UserContext } from "../components/UserContext";

const SidebarPelajar = ({onMateriChange, onLoadMateri, activeMateri, onCourseChange, updateCProgress}) => {
  const [course, setCourse] = useState({
    name: '',
    materi: [],
  });
  const { id } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [participant, setParticipant] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [courseData, setCourseData] = useState({});
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const incrementalId = useRef(0);

  // const fetchCourseData = async () => {
  //   try {
  //     const response = await api.get(`/courses/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setCourseData(response.data);
  //   } catch (error) {
  //     console.error('Error fetching course data:', error);
  //   }
  // };

  const fetchMateriDanQuiz = async () => {
    if (!activeCourse) return;
  
    try {
      const [materiResponse, quizResponse] = await Promise.all([
        api.get(`/materials/course/${activeCourse.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/quizzes/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      const mappedMateri = materiResponse.data?.map((materi) => ({
        id: materi.id_materi,
        name: materi.nama_materi,
        mat_type: materi.jenis_materi,
        type: "materi",
        content: `http://localhost:5000/uploads/materials/${materi.konten_materi}`,
      })) || [];
  
      const mappedQuiz = quizResponse.data?.map((quiz) => ({
        id_quiz: quiz.id_quiz,
        name: quiz.nama_quiz,
        duration: quiz.durasi,
        type: "quiz",
      })) || [];
  
      const combinedData = [...mappedMateri, ...mappedQuiz]
        .sort((a, b) => a.id - b.id_quiz) // Urutkan berdasarkan ID asli
        .map((item, index) => ({ ...item, new_id: index + 1 })); // Tambahkan new_id sebagai penomoran berurutan
  
      setCourse((prevCourse) => ({
        ...prevCourse,
        materi: combinedData,
      }));
  
      if (combinedData.length > 0) {
        handleSetFirstItem(combinedData);
      }
    } catch (error) {
      console.error("Error fetching materi and quiz:", error);
      Swal.fire("Error", "Failed to fetch materi and quizzes. Please try again later.", "error");
    }
  }; 

  const handleSetFirstItem = (materiList) => {
    if (materiList.length > 0) {
      const firstItem = materiList[0]; // Ambil item pertama (sudah diurutkan)
      setSelectedMateri(firstItem.new_id); // Gunakan new_id
      onMateriChange(firstItem);
    }
  };  

  const verifyEnrollment = async () => {
    try {
      console.log(user.userData.id_pelajar);
      console.log(id);
      await api.get(`/participant/progress/${id}/${user.userData.id_pelajar}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error.response?.status === 403) {
        navigate(`/course/${id}`);
      }
    }
  };

  const fetchCParticipant = async () => {
    try {
      const response = await api.get(`/participant/pelajar/${user.userData.id_pelajar}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mappedCourses = response.data.map((item) => ({
        id: item.course.id_course,
        title: item.course.nama_course,
        progress: item.persentase_course,
      }));
      setParticipant(mappedCourses);

      if (mappedCourses.length > 0) {
        setActiveCourse(mappedCourses[0]);
        onCourseChange(mappedCourses[0]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (activeCourse) {
      updateCProgress(activeCourse.id, activeCourse.progress);
      fetchMateriDanQuiz();
    }
  }, [activeCourse]);

  useEffect(() => {
    if (activeMateri) {
      setSelectedMateri(activeMateri.new_id);
  }}, [activeMateri]);

  useEffect(() => {
    if (id) {
      verifyEnrollment();
      fetchAllData();
    }
  }, [id]);

  const handleMateriClick = (materi) => {
    setSelectedMateri(materi.new_id);
    onMateriChange(materi);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ padding: "0px 0px" }}>
      <div className="container-fluid h-100 d-flex" style={{ padding: "0px 0px" }}>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          style={{
            backgroundColor: "#f8f9fa",
            border: "none",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="sidebarMenu">
          <div className="sidebar-container d-flex flex-column p-3">
            {activeCourse ? (
              <>
                <h4 className="course-title">{activeCourse.title}</h4>
                <div className="d-flex align-items-center justify-content-center my-3">
                  <div className="progress" style={{ height: "10px", width: "90%" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${activeCourse.progress}%`,
                        backgroundColor: activeCourse.progress === 0 ? "#6488EA" : "#EA6488",
                      }}
                      aria-valuenow={activeCourse.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="text-muted ms-2">{activeCourse.progress}%</span>
                </div>
                <hr className="custom-hr" />
                <ul className="learn-list mt-1">
                  {course.materi.map((materi) => (
                    <li
                      key={materi.new_id}
                      className={`learn-list-item d-flex align-items-center ${
                        selectedMateri === materi.new_id ? "active" : ""
                      }`}
                      onClick={() => handleMateriClick(materi)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="icon ms-3 me-3">
                        {materi.type === "materi" ? (
                          <img src="/materi.png" alt="Materi" style={{ width: "20px", height: "20px", marginTop: "-5px" }} />
                        ) : (
                          <img src="/quiz.png" alt="Quiz" style={{ width: "20px", height: "20px", marginTop: "-5px" }} />
                        )}
                      </span>
                      {materi.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No active course available.</p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarPelajar;
