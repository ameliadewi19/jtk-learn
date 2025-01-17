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
    const [progress, setProgress] = useState(null);

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

    const fetchProgress = async () => {
        try {
            const response = await api.get(`/participant/progress/${id}/${user.userData.id_pelajar}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProgress(response.data);
        } catch (error) {
            setError('Failed to load progress data.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCourseData();
        if (user?.role === 'pelajar') {
            fetchProgress();
        }
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
                <button
                    className="back-button-text"
                    onClick={() =>
                        navigate(user?.role === 'pengajar' ? '/dashboard-pengajar' : '/dashboard-pelajar')
                    }
                >
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
                        Instructor: {courseData?.pengajar?.nama || ''}
                    </div>
                    {user?.role === 'pengajar' && (
                        <>
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
                        </>
                    )}
                    {user?.role === 'pelajar' && (
                        <>
                            <div className="progress-wrapper">
                                {progress && progress.persentase_course !== null ? (
                                    <>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill"
                                                role="progressbar"
                                                aria-valuenow={progress.persentase_course}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: `${progress.persentase_course}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="progress-percentage-text">
                                            {progress.persentase_course}%
                                        </span>
                                    </>
                                ) : (
                                    <span>Loading progress...</span>
                                )}
                            </div>
                            <div className="button-overview-container">
                                <button
                                    type="button"
                                    className="button-overview"
                                    onClick={() => navigate(`/learn-course`)}
                                >
                                    {progress?.persentase_course < 100 ? 'Continue Course' : 'View Course'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseOverviewPage;
