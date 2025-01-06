import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';

const DashboardPelajar = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const studentName = localStorage.getItem('nama');

  const fetchCourses = async () => {
    try{
      const response = await api.get('/courses',{
        headers:{ Authorization: `Bearer ${token}`,
      },
      });

      const mappedCourses = response.data.map((course) => ({
        id: course.id_course,
        title: course.nama_course,
        description: course.deskripsi,
        author: course.pengajar.nama,
        image: `/uploads/images/${course.gambar_course}`,
      }));
      setCourseList(mappedCourses);
    }catch(error){
      console.error('Error fetching courses:', error);
      Swal.fire('Error', 'Failed to fetch courses. Please try again later.', 'error');
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <div className="container mt-4 ms-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-light mb-0">Hi, {studentName}!</h3>
        </div>
        <h3 className="fw-bold mb-4">Courses</h3>
      </div>
      <div className="container ms-5">
        <div className="row card-courses">
          {courseList.length > 0 ? (
            courseList.map((course) => (
              <div key={course.id} className="col-md-3 mb-3 ms-5">
                <div className="card">
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
            ))
          ) : (
            <p className="text-center">No courses available at the moment.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPelajar;