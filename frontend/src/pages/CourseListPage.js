import React, { useState, useEffect } from 'react';
import CourseModal from '../components/AddCourseModal';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';

const CourseList = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const idPengajar = localStorage.getItem('idPengajar');

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filteredCourses = response.data.filter(
        (course) => course.id_pengajar.toString() === idPengajar
      );

      const mappedCourses = filteredCourses.map((course) => ({
        id: course.id_course,
        title: course.nama_course,
        description: course.deskripsi,
        enrollmentKey: course.enrollment_key,
        author: course.pengajar.nama,
        image: `/uploads/images/${course.gambar_course}`,
      }));

      setCourseList(mappedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire('Error', 'Failed to fetch courses. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const handleAddCourse = async (newCourse) => {
    try {
      // Buat FormData untuk mengirimkan data termasuk gambar
      const formData = new FormData();
      formData.append('id_pengajar', idPengajar);
      formData.append('nama_course', newCourse.courseName);
      formData.append('enrollment_key', newCourse.enrollmentKey);
      formData.append('deskripsi', newCourse.description);
  
      // Tambahkan gambar jika ada, jika tidak gunakan default
      if (newCourse.image) {
        formData.append('gambar_course', newCourse.image); // tambahkan file gambar
      } else {
        formData.append('gambar_course', 'default.jpg'); // nama file default
      }

      console.log('formData: ', formData);
  
      // Kirim POST request dengan FormData
      const response = await api.post('/courses', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Header untuk FormData
        },
      });
  
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const formData = new FormData();
      formData.append('nama_course', updatedCourse.courseName);
      formData.append('enrollment_key', updatedCourse.enrollmentKey);
      formData.append('deskripsi', updatedCourse.description);
  
      if (updatedCourse.image) {
        // Jika pengguna memilih gambar baru, tambahkan ke FormData
        formData.append('gambar_course', updatedCourse.image);
      } else if (updatedCourse.currentImage) {
        // Jika tidak ada gambar baru, gunakan gambar awal
        formData.append('gambar_course', updatedCourse.currentImage);
      }
  
      await api.put(`/courses/${currentCourse.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };
  
  const handleDeleteCourse = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/courses/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200) {
            // Hapus course dari state lokal
            setCourseList((prevCourses) =>
              prevCourses.filter((course) => course.id !== id)
            );
  
            Swal.fire('Deleted!', 'The course has been deleted.', 'success');
          } else {
            throw new Error('Failed to delete the course.');
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          Swal.fire('Error', 'Failed to delete the course. Please try again later.', 'error');
        }
      }
    });
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Courses</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setCurrentCourse(null);
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          + Course
        </button>
      </div>
      <div className="row">
        {courseList.map((course) => (
          <div key={course.id} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm position-relative">
              <button
                  className="btn btn-sm btn-warning position-absolute top-0 end-0 m-2 me-5"
                  onClick={() => openEditModal(course)}
                >
                  <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                onClick={() => handleDeleteCourse(course.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
              <img
                src={course.image}
                className="card-img-top fixed-image"
                alt={course.title}
              />
              <div className="card-body">
                <h6 className="card-title fw-bold">{course.title}</h6>
                <p className="card-text">{course.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <CourseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={isEditing ? handleEditCourse : handleAddCourse}
        initialData={currentCourse}
      />
    </div>
  );
}

export default CourseList;