import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token');
    // Arahkan ke halaman login
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">JTK Learn</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/list-course">Courses</Link>
            </li>
          </ul>
          <button 
            className="btn btn-outline-danger" 
            onClick={handleLogout} 
            style={{ marginLeft: 'auto' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;