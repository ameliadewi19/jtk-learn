import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { UserContext } from '../components/UserContext';

const DashboardPelajar = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleCourseClick = () => {
    navigate(`/learn-course`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="container-dashboard">
        <h3 className="greeting-title">Hi, {user.userData.nama}!</h3>
        <h3 className="courses-title">Courses</h3>
        <div className="row row-custom-gap">
          {courseList.length > 0 ? (
            courseList.map((course) => (
              <div 
                key={course.id_course} 
                className="col-md-3 mb-3 ms-5"
                onClick={() => handleCourseClick(course.id_course)}  
              >
                <div className="card">
                  <img
                    src={course.image}
                    className="card-img-top"
                    alt={course.title}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{course.title}</h6>
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
    </div>
  );
};

export default DashboardPelajar;
