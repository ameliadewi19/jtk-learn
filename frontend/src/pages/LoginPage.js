import React, { useState, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../components/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
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
      localStorage.setItem('user', JSON.stringify(data.user)); // Simpan data user di localStorage
      setUser(data.user); // Perbarui state global user
      if (data.user.role === 'pengajar') {
        localStorage.setItem('idPengajar', data.user.userData.kode_dosen);
        navigate('/list-course');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Email or password is incorrect!',
      });
    }
  };

  return (
    <main className='font-montserrat'>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="card login-card shadow-lg mb-3 px-4">
                  <div className="top-red-rectangle"></div>
                  <div className="bottom-red-rectangle"></div>
                  <div className='top-blue-rectangle'></div>
                  <div className='bottom-blue-rectangle'></div>
                  <div className="card-body">
                    <div className="pt-3 pb-2">
                      {/* center logo (logo file in public/logo512.png) */}
                      <div className="text-center">
                        .          <img src="/logo512.png" alt="logo" width="100" />
                      </div>
                      <h5 className="card-title text-left pb-0 fs-4 fw-bold">Selamat datang,</h5>
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

                      <div className="col-12 text-center">
                        <button className="btn-danger fw-bold" type="submit">
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