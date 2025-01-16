import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { UserContext } from '../components/UserContext';

const CourseOverviewPage = () => {
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const token = localStorage.getItem('token');

    const fetchCourseData = async () => {
        try {
            const response = await api.get(`/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourseData(response.data);
        } catch (error) {
            console.error('Error fetching course data:', error);
            setError('Failed to load course data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="course-pengajar-container">
            <div className="back-button">
                <button className="back-button-text" onClick={() => navigate('/dashboard-pengajar')}>
                    <span>&larr;</span> Back to Dashboard
                </button>
                <div className="back-button-background"></div>
            </div>
            <div className="form-wrapper">
                {/* Left Section: Image Display */}
                <div className="image-upload-section">
                    <div className="upload-placeholder">
                        {courseData?.gambar_course ? (
                            <img
                                src={`/uploads/images/${courseData.gambar_course}`}

                                className="image-preview"
                            />
                        ) : (
                            <p>No image available</p>
                        )}
                    </div>
                </div>
                {/* Right Section: Course Information */}
                <div className="course-info">
                    <div className="detail-info">
                        <h3 className="course-title">
                            {courseData?.nama_course || 'Course Name'}
                        </h3>
                    </div>
                    <div className="detail-info course-description">
                        {courseData?.deskripsi || 'Description not available'}
                    </div>
                    <div className="detail-info course-instructor">
                        Instructor: {user.userData.nama}
                    </div>
                    <div className="detail-info course-enrollment">
                        Enrollment Key: {courseData?.enrollment_key || ''}
                    </div>
                    <div className="button-overview-container">
                        <button
                            type="button"
                            className="button-overview"
                            onClick={() => navigate(`/edit-course`)}
                        >
                            View Course
                        </button>
                        <button
                            type="button"
                            className="button-overview"
                            onClick={() => navigate(`/edit-info-course/${id}`)}
                        >
                            Edit Info Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseOverviewPage;
