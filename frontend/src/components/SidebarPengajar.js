import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaEllipsisV, FaGripVertical } from 'react-icons/fa';
import { useEffect } from "react";
import Swal from "sweetalert2";
import api from "../services/api";


const SidebarPengajar = () => {

  // Dummy data untuk course, materi, dan quiz
  const [course, setCourse] = useState({
    name: "Pengenalan Pemrograman Web",
    materi: [],
  });
  const id_course = 1; // Dummy id_course untuk testing

  // const [course, setCourse] = useState({
  //   name: "Matematika Diskrit",
  //   materi: [
  //     { id: 1, name: "Logika Proposisi", type: "materi" },
  //     { id: 2, name: "Kuis Logika Proposisi", type: "quiz" },
  //     { id: 3, name: "Dummy", type: "quiz" },
  //   ],
  // });

  const [selectedMateri, setSelectedMateri] = useState(course.materi[0]?.id || null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const token = localStorage.getItem('token');
  
  const fetchMateriByCourse = async () => {
    try {
      const id_course = 1; // Dummy id_course untuk testing

      const response = await api.get(`/materials/course/${id_course}`, {
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

  useEffect(() => {
    if (id_course) {
      fetchMateriByCourse();
    }
  }, [id_course]);

  const handleClick = (item) => {
    setSelectedMateri(item.id);
  };

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEdit = (item) => {
    alert(`Edit ${item.name}`);
  };

  const handleDelete = (item) => {
    alert(`Delete ${item.name}`);
  };

  const handleAddMaterial = () => {
    alert("Add Material");
  };

  const handleAddQuiz = () => {
    alert("Add Quiz");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDragStart = (e, itemId) => {
    setDraggedItemId(itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItemId) => {
    const draggedIndex = course.materi.findIndex(item => item.id === draggedItemId);
    const targetIndex = course.materi.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a copy of the materi array
    const updatedMateri = [...course.materi];

    // Move the dragged item to the target position
    const [draggedItem] = updatedMateri.splice(draggedIndex, 1);
    updatedMateri.splice(targetIndex, 0, draggedItem);

    setCourse({ ...course, materi: updatedMateri });
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
              {course.materi.map((item) => (
                <li
                  key={item.id}
                  className={`learn-list-item d-flex align-items-center ${selectedMateri === item.id ? "active" : ""}`}
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
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
    </nav>
  );
};

export default SidebarPengajar;
