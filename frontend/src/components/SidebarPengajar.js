import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaEllipsisV, FaGripVertical } from 'react-icons/fa';
import Swal from "sweetalert2";
import api from "../services/api";
import QuizModal from "./QuizModal";
import MaterialModal from './MaterialModal';


const SidebarPengajar = () => {
  const { id } = useParams(); // Get the id from the URL parameters
  const { id } = useParams(); // Get the id from the URL parameters
  const [course, setCourse] = useState({
    name: "",
    items: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
    name: "",
    items: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialInitialData, setMaterialInitialData] = useState(null);
  const [quizInitialData, setQuizInitialData] = useState(null);
  const [isEditMaterial, setIsEditMaterial] = useState(false);
  const [isEditQuiz, setIsEditQuiz] = useState(false);
  const token = localStorage.getItem('token');
  const incrementalId = useRef(0);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourse((prevCourse) => ({
        ...prevCourse,
        name: response.data.nama_course,
      }));
    } catch (error) {
      console.error('Error fetching course:', error);
      Swal.fire('Error', 'Failed to fetch course. Please try again later.', 'error');
    }
  };

  const fetchMateriByCourse = async () => {
    try {
      const response = await api.get(`/materials/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map((materi) => ({
        id: incrementalId.current++,
        id_item: materi.id_materi,
        name: materi.nama_materi,
        type: 'materi',
      }));
    } catch (error) {
      console.error('Error fetching materi:', error);
      Swal.fire('Error', 'Failed to fetch materi. Please try again later.', 'error');
      return [];
    }
  };

  const fetchQuizByCourse = async () => {
    try {
      const response = await api.get(`/quizzes/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map(quiz => ({
        id: incrementalId.current++,
        id_item: quiz.id_quiz,
        name: quiz.nama_quiz,
        type: 'quiz',
      }));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      Swal.fire('Error', 'Failed to fetch quiz. Please try again later.', 'error');
      return [];
    }
  };

  const fetchQuizData = async (idQuiz) => {
    try {
      const response = await api.get(`/quizzes/${idQuiz}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      Swal.fire('Error', 'Failed to fetch quiz data. Please try again later.', 'error');
    }
  };

  const fetchMaterialData = async (idMateri) => {
    try {
      const response = await api.get(`/materials/${idMateri}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching material data:', error);
      Swal.fire('Error', 'Failed to fetch material data. Please try again later.', 'error');
    }
  };

  const fetchAllData = async () => {
    const [materi, quiz] = await Promise.all([fetchMateriByCourse(), fetchQuizByCourse()]);
    setCourse(prev => ({ ...prev, items: [...materi, ...quiz] }));
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchAllData();
    }
  }, [id]);

  const handleClick = (item) => {
    setSelectedItem(item.id);
  };

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEdit = (item) => {
    if (item.type === 'quiz') {
      fetchQuizData(item.id_item)
        .then((data) => {
          setQuizInitialData(data);
        })
      setIsEditQuiz(true);
      setShowQuizModal(true);
    } else {
      fetchMaterialData(item.id_item)
        .then((data) => {
          setMaterialInitialData(data);
        })
      setIsEditMaterial(true);
      setShowMaterialModal(true);
    }
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete this? This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      cancelButtonColor: '#6488EA',
      confirmButtonColor: '#EA6488',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        if (item.type === 'materi') {
          api.delete(`/materials/${item.id_item}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(() => {
              setCourse((prevCourse) => ({
                ...prevCourse,
                items: prevCourse.items.filter((i) => i.id !== item.id),
              }));
              Swal.fire({
                title: 'Success!',
                text: 'Course material deleted successfully.',
                icon: 'success',
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'custom-confirm-button',
                },
              })
            })
            .catch((error) => {
              console.error('Error deleting course material:', error);
              Swal.fire({
                title: 'Error',
                text: 'Failed to delete course material. Please try again later.', icon: 'error',
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'custom-confirm-button',
                },
              });
            });
        } else {
          api.delete(`/quizzes/${item.id_item}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(() => {
              setCourse((prevCourse) => ({
                ...prevCourse,
                items: prevCourse.items.filter((i) => i.id !== item.id),
              }));
              Swal.fire('Success', 'Quiz has been deleted successfully.', 'success');
            })
            .catch((error) => {
              console.error('Error deleting quiz:', error);
              Swal.fire('Error', 'Failed to delete quiz. Please try again later.', 'error');
            });
        }
      }
    });
  };

  const handleAddMaterial = () => {
    setMaterialInitialData(null);
    setIsEditMaterial(false);
    setShowMaterialModal(true);
  };

  const handleAddQuiz = () => {
    setQuizInitialData(null);
    setIsEditQuiz(false);
    setShowQuizModal(true);
  };

  const handleQuizSubmit = (data) => {
    try {
      if (isEditQuiz) {
        api.put(`/quizzes/${data.id_quiz}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            setCourse((prevCourse) => ({
              ...prevCourse,
              items: prevCourse.items.map((item) => {
                if (item.id_item === data.id_quiz) {
                  return { ...item, name: data.nama_quiz };
                }
                return item;
              }),
            }));
            Swal.fire('Success', 'Quiz has been updated successfully.', 'success');
          })
          .catch((error) => {
            console.error('Error updating quiz:', error);
            Swal.fire('Error', 'Failed to update quiz. Please try again later.', 'error');
          });
      } else {
        api.post('/quizzes', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            setCourse((prevCourse) => ({
              ...prevCourse,
              items: [...prevCourse.items, { id: incrementalId.current++, id_item: response.data.id_quiz, name: data.nama_quiz, type: 'quiz' }],
            }));
            Swal.fire('Success', 'Quiz has been created successfully.', 'success');
          })
          .catch((error) => {
            console.error('Error creating quiz:', error);
            Swal.fire('Error', 'Failed to create quiz. Please try again later.', 'error');
          });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Swal.fire('Error', 'Failed to submit quiz. Please try again later.', 'error');
    }
    setShowQuizModal(false);
    fetchQuizByCourse(); // Refetch quiz data after submission
  };

  const handleMaterialSubmit = (data) => {
    try {
      if (isEditMaterial) {
        api.put(`/materials/${data.id_materi}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            setCourse((prevCourse) => ({
              ...prevCourse,
              items: prevCourse.items.map((item) => {
                if (item.id === data.id_materi) {
                  return { ...item, name: data.nama_materi };
                }
                return item;
              }),
            }));
            Swal.fire('Success', 'Material has been updated successfully.', 'success');
          })
          .catch((error) => {
            console.error('Error updating material:', error);
            Swal.fire('Error', 'Failed to update material. Please try again later.', 'error');
          });
      } else {
        api.post('/materials', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            setCourse((prevCourse) => ({
              ...prevCourse,
              items: [...prevCourse.items, { id: incrementalId.current++, name: data.nama_materi, type: 'materi' }],
            }));
            Swal.fire('Success', 'Materi berhasil ditambahkan!', 'success');
          })
          .catch((error) => {
            console.error('Error creating material:', error);
            Swal.fire('Error', 'Failed to create material. Please try again later.', 'error');
          });
      }
    } catch (error) {
      console.error('Error submitting material:', error);
      Swal.fire('Error', 'Failed to submit material. Please try again later.', 'error');
    }
    setShowMaterialModal(false);
    fetchMateriByCourse(); // Refetch material data after submission
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDragStart = (itemId) => {
    setDraggedItemId(itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetItemId) => {
    const draggedIndex = course.items.findIndex(item => item.id === draggedItemId);
    const targetIndex = course.items.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a copy of the items array
    const updatedItems = [...course.items];

    // Move the dragged item to the target position
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(targetIndex, 0, draggedItem);

    setCourse({ ...course, items: updatedItems });
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
            <h4 className="course-title">{course.name}</h4>
            <div className="d-flex align-items-center justify-content-center my-1">
              <span className="edit-mode">EDIT MODE!</span>
            </div>

            <hr className="custom-hr" />

            <ul className="learn-list mt-1">
              {course.items.map((item) => (
                <li
                  key={item.id}
                  className={`learn-list-item d-flex align-items-center ${selectedItem === item.id ? "active" : ""}`}
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(item.id)}
                >
                  <span className="icon ms-2">
                    <FaGripVertical style={{ cursor: 'move', marginTop: '-5px', fontSize: '20px' }} />
                  </span>
                  <span className="icon ms-3 me-2">
                    {item.type === "materi" ? (
                      <img src="/materi.png" alt="Materi" style={{ width: "20px", height: "20px", marginTop: "-5px" }} />
                    ) : (
                      <img src="/quiz.png" alt="Quiz" style={{ width: "20px", height: "20px", marginTop: "-5px" }} />
                    )}
                  </span>
                  {item.name}
                  <div className="dropdown ms-auto">
                    <button
                      className="btn btn-link"
                      type="button"
                      style={{ color: "#000" }}
                      onClick={() => handleDropdownToggle(item.id)} // Toggle dropdown berdasarkan ID item
                      aria-expanded={openDropdown === item.id ? 'true' : 'false'}
                    >
                      <FaEllipsisV style={{ fontSize: '15px', marginTop: '-3px' }} />
                    </button>
                    {openDropdown === item.id && (
                      <ul className="dropdown-menu show dropdown-learnlist" aria-labelledby="dropdownMenuButton">
                        <li>
                          <button className="dropdown-item" onClick={() => handleEdit(item)}>
                            <img src="/edit.png" alt="edit" style={{ width: "12px", height: "12px", marginTop: "-5px", marginRight: "7px" }} />
                            Edit
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => handleDelete(item)}>
                            <img src="/delete.png" alt="delete" style={{ width: "12px", height: "12px", marginTop: "-5px", marginRight: "7px" }} />
                            Delete
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-add-learnlist d-flex justify-content-start" onClick={handleAddMaterial}>
                <img src="/add.png" alt="add material" className="icon-add-learnlist" />
                Add Material
              </button>
              <button className="btn btn-add-learnlist d-flex justify-content-start" onClick={handleAddQuiz}>
                <img src="/add.png" alt="add quiz" className="icon-add-learnlist" />
                Add Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
      <QuizModal
        show={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onSubmit={handleQuizSubmit}
        initialData={isEditQuiz ? quizInitialData : null}
      />
      <MaterialModal
        show={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        onSubmit={handleMaterialSubmit}
        initialData={isEditMaterial ? materialInitialData : null}
      />
    </nav>
  );
};

export default SidebarPengajar;