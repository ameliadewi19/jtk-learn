import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import api instance

const ProtectedRoute = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/'); // Redirect ke login jika token tidak ada
        return;
      }

      try {
        const response = await api.get('/protected-route', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data === 'You have access to this route') {
          setHasAccess(true);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Access validation failed:', error);
        navigate('/');
      }
    };

    checkAccess();
  }, [navigate]);

  if (!hasAccess) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
