import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { UserContext } from "../components/UserContext";
import { useCourse } from "../components/CourseContext";

const SidebarPelajar = forwardRef(
  ({ onMateriChange, activeMateri, onCourseChange }, ref) => {
    const [course, setCourse] = useState({ name: "", items: [] });
    const { id } = useParams();
    const [selectedItem, setSelectedItem] = useState(null);
    const [participant, setParticipant] = useState([]);
    const [activeCourse, setActiveCourse] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { setCombinedData } = useCourse();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useImperativeHandle(ref, () => ({
      refreshParticipants: fetchCParticipant,
    }));

    const fetchMateriDanQuiz = async () => {
      if (!activeCourse) return;

      try {
        const [materiResponse, quizResponse] = await Promise.all([
          api.get(`/materials/course/${activeCourse.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/quizzes/course/${activeCourse.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const mappedMateri =
          materiResponse.data?.map((materi) => ({
            id: materi.id_materi,
            name: materi.nama_materi,
            mat_type: materi.jenis_materi,
            type: "materi",
            content: `http://localhost:5000/uploads/materials/${materi.konten_materi}`,
          })) || [];

        const mappedQuiz =
          quizResponse.data?.map((quiz) => ({
            id_quiz: quiz.id_quiz,
            name: quiz.nama_quiz,
            duration: quiz.durasi,
            desc: quiz.deskripsi_quiz,
            type: "quiz",
          })) || [];

        const combinedData = [...mappedMateri, ...mappedQuiz]
          .sort((a, b) => a.id - b.id_quiz)
          .map((item, index) => ({ ...item, new_id: index + 1 }));

        setCourse((prevCourse) => ({
          ...prevCourse,
          items: combinedData,
        }));

        const lastOpenedItem = localStorage.getItem(`lastOpenedItem-${id}`);
        const foundItem = combinedData.find(
          (item) => item.new_id === Number(lastOpenedItem)
        );

        if (foundItem) {
          setSelectedItem(foundItem.new_id);
          onMateriChange(foundItem);
        } else if (combinedData.length > 0) {
          setSelectedItem(combinedData[0].new_id);
          onMateriChange(combinedData[0]);
        }
      } catch (error) {
        console.error("Error fetching materi and quiz:", error);
        Swal.fire(
          "Error",
          "Failed to fetch materi and quizzes. Please try again later.",
          "error"
        );
      }
    };

    const verifyEnrollment = async () => {
      try {
        await api.get(
          `/participant/progress/${id}/${user.userData.id_pelajar}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        if (error.response?.status === 403) {
          navigate(`/course/${id}`);
        }
      }
    };

    const fetchCParticipant = async () => {
      try {
        const response = await api.get(
          `/participant/pelajar/${user.userData.id_pelajar}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mappedCourses = response.data.map((item) => ({
          id: item.course.id_course,
          title: item.course.nama_course,
          progress: item.persentase_course,
        }));

        setParticipant(mappedCourses);

        const matchingCourse = mappedCourses.find(
          (course) => course.id === Number(id)
        );
        if (matchingCourse) {
          setActiveCourse(matchingCourse);
          // Check if onCourseChange is a function before calling
          if (typeof onCourseChange === "function") {
            onCourseChange(matchingCourse);
          } else {
            console.error("onCourseChange is not a function");
          }
        } else {
          setActiveCourse(null);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    useEffect(() => {
      if (course.items.length > 0) {
        setCombinedData(course.items);
      }
    }, [course.items, setCombinedData]);

    useEffect(() => {
      if (activeCourse && activeCourse.id === Number(id)) {
        fetchMateriDanQuiz();
      } else {
        setCourse({ name: "", items: [] });
        setCombinedData([]);
      }
    }, [activeCourse, id]);

    useEffect(() => {
      if (activeMateri) {
        setSelectedItem(activeMateri.new_id);
      }
    }, [activeMateri]);

    useEffect(() => {
      if (id) {
        verifyEnrollment();
        fetchCParticipant();
      }
    }, [id]);

    const handleClick = (item) => {
      setSelectedItem(item.new_id);
      onMateriChange(item);
      localStorage.setItem(`lastOpenedItem-${id}`, item.new_id);
    };

    return (
      <nav className="navbar navbar-expand-lg" style={{ padding: "0px 0px" }}>
        <div
          className="container-fluid h-100 d-flex"
          style={{ padding: "0px 0px" }}
        >
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded={isOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            style={{ backgroundColor: "#f8f9fa", border: "none" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="sidebarMenu"
          >
            <div className="sidebar-container d-flex flex-column p-3">
              {activeCourse ? (
                <>
                  <h4 className="course-title">{activeCourse.title}</h4>
                  <div className="d-flex align-items-center justify-content-center my-3">
                    <div
                      className="progress"
                      style={{ height: "10px", width: "90%" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${activeCourse.progress}%`,
                          backgroundColor:
                            activeCourse.progress === 0 ? "#6488EA" : "#EA6488",
                        }}
                        aria-valuenow={activeCourse.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="text-muted ms-2">
                      {activeCourse.progress}%
                    </span>
                  </div>
                  <hr className="custom-hr" />
                  <ul className="learn-list mt-1">
                    {course.items.map((item) => (
                      <li
                        key={item.new_id}
                        className={`learn-list-item d-flex align-items-center ${
                          selectedItem === item.new_id ? "active" : ""
                        }`}
                        onClick={() => handleClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="icon ms-3 me-3">
                          <img
                            src={
                              item.type === "materi"
                                ? "/materi.png"
                                : "/quiz.png"
                            }
                            alt={item.type === "materi" ? "Materi" : "Quiz"}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginTop: "-5px",
                            }}
                          />
                        </span>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No course available.</p>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
);

export default SidebarPelajar;
