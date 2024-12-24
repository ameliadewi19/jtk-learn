import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      if(data.user.role === 'pengajar') {
        localStorage.setItem('idPengajar', data.user.userData.kode_dosen)
        navigate('/list-course');
      } else {
        navigate('/dashboard');
      }
      localStorage.setItem('nama', data.user.userData.nama);
    } catch (error) {
      console.log('error login: ', error)
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Email or password is incorrect!',
      });
    }
  };

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Selamat Datang</h5>
                    </div>
  
                    <form onSubmit={handleSubmit} className="row g-3 needs-validation" noValidate>
                      <div className="col-12">
                        <label htmlFor="yourEmail" className="form-label">
                          Email
                        </label>
                        <div className="input-group has-validation">
                          <input
                            className="form-control form-control-lg"
                            type="email"
                            placeholder="Masukkan email Anda"
                            value={email}
                            onChange={handleEmailChange}
                            required
                          />
                          <div className="invalid-feedback">Please enter your email.</div>
                        </div>
                      </div>
  
                      <div className="col-12">
                        <label htmlFor="yourPassword" className="form-label">
                          Password
                        </label>
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="Masukkan password Anda"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        <div className="invalid-feedback">Please enter your password!</div>
                      </div>
  
                      <div className="col-12">
                        <button className="btn btn-primary w-100" type="submit">
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
  
                <div className="credits"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;