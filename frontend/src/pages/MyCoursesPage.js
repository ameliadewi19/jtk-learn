import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { UserContext } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';


const MyCoursesPage = () => {
    const [activeTab, setActiveTab] = useState('inprogress');
    const [inProgressCourses, setInProgressCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const token = localStorage.getItem('token');
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/participant/pelajar/${user.userData.id_pelajar}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const inProgress = [];
                const completed = [];
                response.data.forEach((item) => {
                    const course = {
                        id: item.course.id_course,
                        title: item.course.nama_course,
                        description: item.course.deskripsi,
                        author: item.course.pengajar.nama,
                        image: `/uploads/images/${item.course.gambar_course}`,
                        progress: item.persentase_course,
                    };
                    if (item.status_penyelesaian === "Completed") {
                        completed.push(course);
                    } else {
                        inProgress.push(course);
                    }
                });
    
                setInProgressCourses(inProgress);
                setCompletedCourses(completed);
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCourses();
    }, []);    
    
    if (loading) return <p>Loading...</p>;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCourseClick = () => {
        navigate(`/learn-course`);
    };

    return(
        <>
            <ul className="nav nav-tabs ms-5 mt-3 mb-3" id="justify-tab" role="tablist">
                <li className="nav-item-tab" role="presentation">
                <button
                    className={`nav-link ${activeTab === 'inprogress' ? 'active' : ''} nav-link-tab`}
                    id="inprogress-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#inprogress"
                    type="button"
                    role="tab"
                    aria-controls="inprogress"
                    aria-selected={activeTab === 'inprogress'}
                    onClick={() => handleTabChange('inprogress')}
                >
                    In Progress
                </button>
                </li>
                <li className="nav-item-tab" role="presentation">
                <button
                    className={`nav-link ${activeTab === 'completed' ? 'active' : ''} nav-link-tab`}
                    id="completed-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#completed"
                    type="button"
                    role="tab"
                    aria-controls="completed"
                    aria-selected={activeTab === 'completed'}
                    onClick={() => handleTabChange('completed')}
                >
                    Completed
                </button>
                </li>
            </ul>
            <div className="tab-content">
                <div
                className={`tab-pane fade ${activeTab === 'inprogress' ? 'show active' : ''}`}
                id="inprogress"
                role="tabpanel"
                aria-labelledby="inprogress-tab"
                >
                    <div className="container-fluid py-4">
                        <div className="container-dashboard">
                            <div className="row row-custom-gap">
                                {inProgressCourses.length > 0 ? (
                                    inProgressCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="col-md-3 mb-3 ms-5"
                                            onClick={() => handleCourseClick(course.id)}
                                        >
                                            <div className="card">
                                                <img
                                                    src={course.image}
                                                    className="card-img-top"
                                                    alt={course.title}
                                                />
                                                <div className="card-body-mycourse">
                                                    <h6 className="card-title">{course.title}</h6>
                                                    <p className="card-text">{course.author}</p>
                                                    <div className='progress-container'>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar"
                                                                role="progressbar"
                                                                style={{
                                                                    width: `${course.progress}%`,
                                                                    backgroundColor: course.progress === 0 ? '#6488EA' : '#EA6488',
                                                                }}
                                                                aria-valuenow={course.progress}
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <span className="progress-percentage">{course.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No courses in progress.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`}
                id="completed"
                role="tabpanel"
                aria-labelledby="completed-tab"
                >
                    <div className="container-fluid py-4">
                        <div className="container-dashboard">
                            <div className="row row-custom-gap">
                                {completedCourses.length > 0 ? (
                                    completedCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="col-md-3 mb-3 ms-5"
                                            onClick={() => handleCourseClick(course.id)}
                                        >
                                            <div className="card">
                                                <img
                                                    src={course.image}
                                                    className="card-img-top"
                                                    alt={course.title}
                                                />
                                                <div className="card-body-mycourse">
                                                    <h6 className="card-title">{course.title}</h6>
                                                    <p className="card-text">{course.author}</p>
                                                    <div className='progress-container'>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar"
                                                                role="progressbar"
                                                                style={{
                                                                    width: `${course.progress}%`,
                                                                    backgroundColor: course.progress === 0 ? '#6488EA' : '#EA6488',
                                                                }}
                                                                aria-valuenow={course.progress}
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <span className="progress-percentage">{course.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No courses completed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyCoursesPage;
