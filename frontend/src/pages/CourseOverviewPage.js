import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CourseOverviewPage = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchCourseData = async () => {
        try {
            const response = await api.get(`/courses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCourseData(response.data);
        } catch (error) {
            console.error('Error fetching course data:', error);
            navigate('/not-found');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!courseData) {
        return <div className="text-center mt-5">Course not found.</div>;
    }

    return (
        <div className="course-pengajar-container">
            <div className="back-button">
                <button className='back-button-text' onClick={() => navigate('/dashboard-pengajar')}>
                    <span>&larr;</span> Back to Dashboard
                </button>
                <div className="back-button-background"></div>
            </div>
            <div className="form-wrapper">
                <div className="image-upload-section">
                    <div className="upload-placeholder">
                        {courseData.gambar_course && (
                            <img
                                src={`/uploads/images/${courseData.gambar_course}`}
                                alt={courseData.nama_course}
                                className="image-preview"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="form-section">
                <div className="form-group">
                    <label>Nama Course</label>
                    <p>{courseData.nama_course}</p>
                </div>
                <div className="form-group">
                    <label>Deskripsi Course</label>
                    <p>{courseData.deskripsi}</p>
                </div>
                <div className="form-group">
                    <label>Pengajar</label>
                    <p>{courseData.pengajar.nama}</p>
                </div>
                <div className="form-group">
                    <label>Enrollment Key</label>
                    <p>{courseData.enrollment_key}</p>
                </div>
                <div className="button-container">
                    <button
                        type="button"
                        className="create-button"
                        onClick={() => navigate('')} // Ganti '' dengan path tujuan
                    >
                        View Course
                    </button>
                </div>
                <div className="button-container">
                    <button
                        type="button"
                        className="create-button"
                        onClick={() => navigate(`/edit-info-course/${id}`)}
                    >
                        Edit Info Course
                    </button>
                </div>


            </div>
        </div>
    );
};

export default CourseOverviewPage;
