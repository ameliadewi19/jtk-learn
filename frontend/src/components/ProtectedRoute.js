import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; 
import api from '../services/api'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        navigate('/'); // Arahkan ke login jika tidak ada data
      }
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    navigate('/'); // Arahkan ke login jika role tidak sesuai
    return null;
  }

  return <>{children}</>;
};


export default ProtectedRoute;
