import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { UserContext } from '../components/UserContext';
import MessageModal from '../components/MessageModal';

const CoursePengajarPage = () => {
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const idPengajar = user.userData.kode_dosen;
    const [formData, setFormData] = useState({
        courseName: '',
        description: '',
        enrollmentKey: '',
    });
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [messageModal, setMessageModal] = useState({
        show: false,
        type: '',
        message: '',
    });
    const [showCancelModal, setShowCancelModal] = useState(false);  // Add state for cancel modal

    const handleAddOrUpdate = async (newCourse) => {
        try {
            setMessageModal({ show: false, type: '', message: '' });

            if (!idPengajar || !newCourse.courseName || !newCourse.enrollmentKey || !newCourse.description) {
                setMessageModal({
                    show: true,
                    type: 'error',
                    message: 'Harap lengkapi semua kolom yang diperlukan: Nama Course, Deskripsi, dan Enrollment Key.',
                });
                return;
            }

            if (newCourse.enrollmentKey.length < 8 || newCourse.enrollmentKey.length > 12) {
                setMessageModal({
                    show: true,
                    type: 'error',
                    message: 'Enrollment key harus memiliki 8-12 karakter.',
                });
                return;
            }

            const formData = new FormData();
            formData.append('id_pengajar', idPengajar);
            formData.append('nama_course', newCourse.courseName);
            formData.append('enrollment_key', newCourse.enrollmentKey);
            formData.append('deskripsi', newCourse.description);

            if (image instanceof File) {
                const formattedName = newCourse.courseName.replace(/\s+/g, '_');
                const renamedImage = new File([image], `${formattedName}.png`, { type: image.type });
                formData.append('gambar_course', renamedImage);
            } else {
                formData.append('gambar_course', null);
            }

            const response = isEditMode
                ? await api.put(`/courses/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
                : await api.post('/courses', formData, { headers: { Authorization: `Bearer ${token}` } });

            setMessageModal({
                show: true,
                type: 'success',
                message: isEditMode ? "Course berhasil diperbarui!" : "Course berhasil ditambahkan!",
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan';
            setMessageModal({ show: true, type: 'error', message: errorMessage });
        }
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchCourseData = async () => {
                try {
                    const response = await api.get(`/courses/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFormData({
                        courseName: response.data.nama_course,
                        description: response.data.deskripsi,
                        enrollmentKey: response.data.enrollment_key,
                    });
                    setImage(response.data.gambar_course);
                } catch (error) {
                    console.error('Error fetching course data:', error);
                }
            };
            fetchCourseData();
        }
    }, [id]);

    const handleCloseMessageModal = () => {
        setMessageModal({ show: false, type: '', message: '' });

        if (messageModal.type === 'success') {
            if (isEditMode) {
                navigate(`/course/${id}`, { replace: true });
            } else {
                navigate('/dashboard-pengajar', { replace: true });
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setMessageModal({ show: false, type: '', message: '' });

        const file = e.target.files[0];
        if (file) {
            const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!validFormats.includes(file.type)) {
                setMessageModal({
                    show: true,
                    type: 'error',
                    message: 'Unggah gagal! Gunakan format JPG/PNG/JPEG.',
                });
                return;
            }

            if (file.size > maxSize) {
                setMessageModal({
                    show: true,
                    type: 'error',
                    message: 'Unggah gagal! Ukuran file maksimal 2MB.',
                });
                return;
            }

            setImage(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCourse = {
            courseName: formData.courseName,
            description: formData.description,
            enrollmentKey: formData.enrollmentKey,
        };
        handleAddOrUpdate(newCourse);
    };

    const handleCancel = () => {
        setShowCancelModal(true); 
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false); 
        isEditMode ? navigate(`/course/${id}`) : navigate('/dashboard-pengajar');
    };

    const handleRejectCancel = () => {
        setShowCancelModal(false); 
    };

    return (
        <div className="course-pengajar-container">
            <div className="back-button">
                <button className='back-button-text' onClick={() => navigate('/dashboard-pengajar')}>
                    <span>&larr;</span> Back to Dashboard
                </button>
                <div className="back-button-background"></div>
            </div>
            <div className="form-wrapper">
                {/* Left Section: Image Upload */}
                <div className="image-upload-section">
                    <div className="upload-placeholder">
                        {isEditMode ? (
                            image ? (
                                <img
                                    src={`/uploads/images/${image}`}
                                    alt="Preview"
                                    className="image-preview"
                                />
                            ) : (
                                <p>No image available</p>
                            )
                        ) : (
                            image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="image-preview"
                                />
                            ) : (
                                <p>Select file from device</p>
                            )
                        )}
                    </div>
                    <label className="upload-button">
                        {isEditMode ? 'Change Picture' : 'Upload Picture'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                    </label>
                </div>
                {/* Right Section: Form Fields */}
                <div className="form-section">
                    <form id="courseForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nama Course</label>
                            <input
                                type="text"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleInputChange}
                                placeholder="Enter course name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Deskripsi Course</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter course description"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>
                                Instructor
                                <span className="tooltip-icon">
                                    <img src="/info.png" alt="info" />
                                    <span className="tooltip-text">Diambil otomatis dari nama pengguna</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                value={user.userData.nama}
                                readOnly
                                className="read-only-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Enrollment Key</label>
                            <input
                                type="text"
                                name="enrollmentKey"
                                value={formData.enrollmentKey}
                                onChange={handleInputChange}
                                placeholder="Enter enrollment key"
                            />
                        </div>
                        <div className="button-container">
                            <button
                                type="button"
                                className="create-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="create-button">
                                {isEditMode ? 'Save' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <MessageModal
                show={showCancelModal}
                type="warning"
                message={isEditMode ? "Apakah Anda yakin ingin membatalkan perubahan course?" : "Apakah Anda yakin ingin membatalkan penambahan course?"}
                onConfirm={handleConfirmCancel}
                onCancel={handleRejectCancel}
            />

            {/* Message Modal for success or error */}
            <MessageModal
                show={messageModal.show}
                type={messageModal.type}
                message={messageModal.message}
                onClose={handleCloseMessageModal}
            />
        </div>
    );
};

export default CoursePengajarPage;
