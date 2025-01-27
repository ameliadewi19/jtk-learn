import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const MaterialModal = ({ show, onClose, onSubmit, initialData }) => {
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    nama_materi: '',
    jenis_materi: '',
    konten_materi: null,
  });

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setFormValues({
        id_materi: initialData.id_materi || '',
        nama_materi: initialData.nama_materi || '',
        jenis_materi: initialData.jenis_materi || '',
        konten_materi: initialData.konten_materi || '',
      });
    } else {
      setFormValues({
        nama_materi: '',
        jenis_materi: '',
        konten_materi: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormValues((prevData) => ({
        ...prevData,
        konten_materi: selectedFile,
      }));
    }
  };
  
  const handleRemoveFile = () => {
    setFormValues((prevData) => ({
      ...prevData,
      konten_materi: null, 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formValues.nama_materi || !formValues.jenis_materi) {
      Swal.fire({
        title: 'Error',
        text: 'Harap lengkapi semua kolom yang diperlukan: Nama Materi dan Jenis Materi.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }
  
    // Gunakan file baru jika diunggah, atau file lama dari initialData
    const file = formValues.konten_materi;
  
    if (!file) {
      Swal.fire({
        title: 'Error',
        text: 'Harap unggah file materi.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }
  
    if (formValues.konten_materi && file instanceof File) {
      const fileSizeMB = file.size / (1024 * 1024);
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
      if (formValues.jenis_materi === "teks") {
        if (fileExtension !== ".pdf" || fileSizeMB > 2) {
          Swal.fire({
            title: 'Error',
            text: 'Jenis materi adalah teks. Harap unggah file dengan format PDF dan ukuran maksimal 2MB.',
            icon: 'error',
            confirmButtonText: 'Close',
          });
          return;
        }
      } else if (formValues.jenis_materi === "video") {
        const allowedExtensions = [".mp4", ".avi", ".mov"];
        if (!allowedExtensions.includes(fileExtension) || fileSizeMB > 360) {
          Swal.fire({
            title: 'Error',
            text: 'Jenis materi adalah video. Harap unggah file dengan format MP4/AVI/MOV dan ukuran maksimal 360MB.',
            icon: 'error',
            confirmButtonText: 'Close',
          });
          return;
        }
      }
    } else if (typeof file === "string") {
      const fileExtension = file.substring(file.lastIndexOf('.')).toLowerCase();
  
      if (formValues.jenis_materi === "teks" && fileExtension !== ".pdf") {
        Swal.fire({
          title: 'Error',
          text: 'Jenis materi adalah teks. File lama tidak valid karena bukan format PDF.',
          icon: 'error',
          confirmButtonText: 'Close',
        });
        return;
      } else if (
        formValues.jenis_materi === "video" &&
        ![".mp4", ".avi", ".mov"].includes(fileExtension)
      ) {
        Swal.fire({
          title: 'Error',
          text: 'Jenis materi adalah video. File lama tidak valid karena bukan format MP4/AVI/MOV.',
          icon: 'error',
          confirmButtonText: 'Close',
        });
        return;
      }
    }
  
    const submissionData = new FormData();
    submissionData.append('id_course', id);
    submissionData.append('id_materi', formValues.id_materi);
    submissionData.append('nama_materi', formValues.nama_materi);
    submissionData.append('jenis_materi', formValues.jenis_materi);
  
    if (formValues.konten_materi && file instanceof File) {
      // File baru diunggah
      const formattedName =
        formValues.nama_materi.replace(/\s+/g, '_') +
        file.name.substring(file.name.lastIndexOf('.'));
      const renamedFile = new File([file], formattedName, { type: file.type });
      submissionData.append('konten_materi', renamedFile);
    } else if (typeof file === "string") {
      // File lama digunakan (URL atau string)
      submissionData.append('konten_materi', file);
    }
  
    onSubmit(submissionData);
    onClose();
  };
  
  

  return (
    <div className={`modal fade ${show ? 'show d-flex' : ''}`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
        <div className="modal-content custom-modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? 'Edit Material' : 'Add Material'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center gap-3">
                <div className="mb-3 flex-grow-1">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="nama_materi"
                    className="form-control"
                    value={formValues.nama_materi}
                    onChange={handleChange}
                    placeholder="Enter material name"
                  />
                </div>
                <div className="mb-3 flex-shrink-0" style={{ width: '40%' }}>
                  <label className="form-label">Type</label>
                  <select
                    name="jenis_materi"
                    className="form-control"
                    value={formValues.jenis_materi}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="teks">Teks</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Upload File</label>
                <div
                  className="upload-container"
                  onClick={() => document.getElementById('upload-file').click()}
                >
                  {/* Jika file sudah ada di konten_materi */}
                  {formValues.konten_materi ? (
                    <div className="uploaded-file">
                      <img
                        src="/document.png"
                        alt="File"
                        style={{
                          width: '50px',
                          height: '50px',
                          display: 'block',
                          marginBottom: '10px',
                        }}
                      />
                      {/* Tampilkan nama file jika ada */}
                      <span>{formValues.konten_materi.name || formValues.konten_materi}</span>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={handleRemoveFile}
                      >
                        <img
                          src="/trash-bin.png"
                          alt="Delete"
                          style={{
                            width: '30px',
                            height: '30px',
                            display: 'block',
                            marginBottom: '10px',
                          }}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-container">
                        <img
                          src="/upload.png"
                          alt="Upload Icon"
                          style={{
                            width: '80px',
                            height: '80px',
                            display: 'block',
                            marginBottom: '10px',
                          }}
                        />
                        <p>
                          Drag and drop file here or{' '}
                          <span
                            className="text-primary text-decoration-underline cursor-pointer"
                            onClick={() => document.getElementById('upload-file').click()}
                          >
                            Choose file
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    id="upload-file"
                    name="konten_materi"
                    onChange={handleFileChange}
                    accept=".pdf, .mp4, .avi, .mov"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;
