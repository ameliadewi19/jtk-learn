import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { UserContext } from '../components/UserContext';

const SidebarPelajar = () => {
  const [course, setCourse] = useState({
    name: '',
    materi: [],
  });
  const { id } = useParams();
  const [courseData, setCourseData] = useState({});
  const [selectedMateri, setSelectedMateri] = useState(course.materi[0]?.id || null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const fetchCourseData = async () => {
    try {
      const response = await api.get(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseData(response.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const fetchMateriByCourse = async () => {
    try {
      const response = await api.get(`/materials/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mappedMateri = response.data.map((materi) => ({
        id: materi.id_materi,
        name: materi.nama_materi,
        type: materi.jenis_materi,
      }));

      setCourse((prevCourse) => ({
        ...prevCourse,
        materi: mappedMateri,
      }));
    } catch (error) {
      console.error('Error fetching materi:', error);
      Swal.fire('Error', 'Failed to fetch materi. Please try again later.', 'error');
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

  useEffect(() => {
    if (id) {
      verifyEnrollment();
      fetchMateriByCourse();
      fetchCourseData();
    }
  }, [id]);

  const handleClick = (item) => {
    setSelectedMateri(item.id);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ padding: '0px 0px' }}>
      <div className="container-fluid" style={{ padding: '0px 0px' }}>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleSidebar}
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
            <h4 className="course-title">{courseData.nama_course}</h4>
            <div className="d-flex align-items-center justify-content-center my-3">
              <div className="progress" style={{ height: "10px", width: "90%" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: course.progress === 0 ? '#6488EA' : '#EA6488'
                  }}
                  aria-valuenow={course.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="text-muted ms-2">{course.progress}%</span>
            </div>
            <hr className="custom-hr" />
            <ul className="learn-list mt-1">
              {course.materi.map((item) => (
                <li
                  key={item.id}
                  className={`learn-list-item d-flex align-items-center ${selectedMateri === item.id ? "active" : ""}`}
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="icon ms-3 me-3">
                    {item.type === "materi" ? (
                      <img src="/materi.png" alt="Materi" style={{ width: "20px", height: "20px", marginTop: "-5px" }} />
                    ) : (
                      <img src="/quiz.png" alt="Quiz" style={{ width: "20px", height: "20px", marginTop: "-5px" }} />
                    )}
                  </span>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarPelajar;
