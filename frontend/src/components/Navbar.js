import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../components/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <a
          className="navbar-brand d-flex align-items-center"
          onClick={() => navigate(user?.role === 'pengajar' ? '/dashboard-pengajar' : '/dashboard-pelajar')}
        >
          <img src="/logo512.png" alt="JTK Learn Logo" className="logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className={`nav-link ${location.pathname === '/dashboard-pengajar' || location.pathname === '/dashboard-pelajar' ? 'active' : ''}`}
                onClick={() => navigate(user?.role === 'pengajar' ? '/dashboard-pengajar' : '/dashboard-pelajar')}
              >
                Dashboard
              </a>
            </li>
            {/* My Courses (only for pelajar) */}
            {user?.role !== 'pengajar' && (
              <li className="nav-item">
                <a
                  className={`nav-link ${location.pathname === '/my-courses' ? 'active' : ''}`}
                  onClick={() => navigate('/my-courses')}
                >
                  My Courses
                </a>
              </li>
            )}
            <li className="nav-item history-quiz">
              <a
                className={`nav-link ${location.pathname === (user?.role === 'pengajar' ? '/summary-quiz' : '/history-quiz') ? 'active' : ''}`}
                onClick={() => navigate(user?.role === 'pengajar' ? '/summary-quiz' : '/history-quiz')}
              >
                {user?.role === 'pengajar' ? 'Summary Quiz' : 'History Quiz'}
              </a>

            </li>
            {/* Dropdown My Account */}
            <li className="nav-name dropdown" ref={dropdownRef}>
              <a
                className="nav-link"
                href="#"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen ? 'true' : 'false'}
              >
                <img src="/user.png" alt="User Profile" className="profile-img" width="35" />
                {user ? user.userData.nama : 'My Account'}
                <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}></span>
              </a>
              {dropdownOpen && (
                <button
                  className="dropdown-button dropdown-position"
                  onClick={handleLogout}
                >
                  <img src="/logout.png" alt="Logout Icon" className="logout-icon" />
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
