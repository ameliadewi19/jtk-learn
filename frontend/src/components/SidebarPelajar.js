import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import api from "../services/api";
import { UserContext } from '../components/UserContext';

const SidebarPelajar = ({ onMateriChange, onLoadMateri, activeMateri, onCourseChange, updateCProgress }) => {
  const { id } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [participant, setParticipant] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [course, setCourse] = useState({ materi: [] });
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);

  useEffect(() => {
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
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCParticipant();
  }, [token, user.userData.id_pelajar]);

  useEffect(() => {
    if (activeCourse) {
      updateCProgress(activeCourse.id, activeCourse.progress);
    }
  }, [activeCourse, updateCProgress]);

  useEffect(() => {
    const fetchMateriByCourse = async () => {
      if (!activeCourse) return;

      try {
        const response = await api.get(`/materials/course/${activeCourse.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappedMateri = response.data.map((materi) => ({
          id: materi.id_materi,
          name: materi.nama_materi,
          type: materi.jenis_materi,
          // content: materi.konten_materi,
          content: `uploads/materials/${materi.konten_materi}`,
        }));

        setCourse((prevCourse) => ({
          ...prevCourse,
          materi: mappedMateri,
        }));

        if (mappedMateri.length > 0) {
          setSelectedMateri(mappedMateri[0].id);
          onMateriChange(mappedMateri[0]);
          onLoadMateri(mappedMateri);
        }
      } catch (error) {
        console.error("Error fetching materi:", error);
        Swal.fire("Error", "Failed to fetch materi. Please try again later.", "error");
      }
    };

    fetchMateriByCourse();
  }, [token, activeCourse]); 

  useEffect(() => {
    if (activeMateri) {
      setSelectedMateri(activeMateri.id);
    }
  }, [activeMateri]);

  const handleMateriClick = (materi) => {
    setSelectedMateri(materi.id);
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
          aria-expanded={isOpen ? "true" : "false"}
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
                      key={materi.id}
                      className={`learn-list-item d-flex align-items-center ${
                        selectedMateri === materi.id ? "active" : ""
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