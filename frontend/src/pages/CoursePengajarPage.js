import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { UserContext } from '../components/UserContext';

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

    const handleAddOrUpdate = async (newCourse) => {
        try {
            if (!idPengajar || !newCourse.courseName || !newCourse.enrollmentKey || !newCourse.description) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Harap lengkapi semua kolom yang diperlukan: Nama Course, Deskripsi, dan Enrollment Key.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    },
                });


                return;
            }

            if (newCourse.enrollmentKey.length < 8 || newCourse.enrollmentKey.length > 12) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Enrollment key harus memiliki 8-12 karakter.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    },
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

            Swal.fire({
                title: 'Success!',
                text: isEditMode ? 'Course berhasil diperbarui!' : 'Course berhasil ditambahkan!',
                icon: 'success',
                confirmButtonText: 'Close',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                },
            }).then(() => {
                isEditMode ? navigate(`/course/${id}`, { replace: true }) : navigate('/dashboard-pengajar', { replace: true });
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan';
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Close',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                },
            });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!validFormats.includes(file.type)) {
                Swal.fire({
                    title: 'Error',
                    text: 'Unggah gagal! Gunakan format JPG/PNG/JPEG.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    },
                });
                return;
            }

            if (file.size > maxSize) {
                Swal.fire({
                    title: 'Error',
                    text: 'Unggah gagal! Ukuran file maksimal 2MB.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    },
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
        Swal.fire({
            title: 'Warning!',
            text: isEditMode
                ? 'Perubahan Anda akan hilang. Apakah Anda yakin ingin membatalkan perubahan course?'
                : 'Apakah Anda yakin ingin membatalkan penambahan course?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Batalkan',
            cancelButtonText: 'Tidak',
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                isEditMode ? navigate(`/course/${id}`) : navigate('/dashboard-pengajar');
            }
        });
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
        </div>
    );
};

export default CoursePengajarPage;
