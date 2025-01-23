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

  const handleCourseClick = (id) => {
    navigate(`/learn-course/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="container-dashboard">
        <h3 className="greeting-title">Hi, {user.userData.nama}!</h3>
        <div className="dashboard-flex">
          <h3 className="courses-title">Courses</h3>
        </div>
        <div className="row row-custom-gap">
          {courseList.length > 0 ? (
            courseList.map((course) => (
              <div
                key={course.id}
                className="col-12 col-sm-6 col-lg-3"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="card custom-card">
                  <img
                    src={course.image}
                    className="custom-card-img-top"
                    alt={course.title}
                  />
                  <div className="custom-card-body">
                    <h6 className="custom-card-title">{course.title}</h6>
                    <p className="custom-card-text">{course.author}</p>
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