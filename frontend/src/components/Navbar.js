import React, { useContext, useState } from 'react';
import { UserContext } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/">
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
                className="nav-link active"
                aria-current="page"
                href={user?.role === 'pengajar' ? '/list-course' : '/dashboard'}>
                Dashboard
              </a>
            </li>
            {user?.role !== 'pengajar' && (
              <li className="nav-item">
                <a className="nav-link" href="/my-courses">My Courses</a>
              </li>
            )}
            <li className="nav-item history-quiz">
              <a className="nav-link" href="/history-quiz">History Quiz</a>
            </li>
            {/* Dropdown My Account */}
            <li className="nav-name dropdown">
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
            {/* End Dropdown */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;