import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false); // State untuk menentukan akses
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage

      if (!token) {
        navigate('/'); // Arahkan ke login jika token tidak ada
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/protected-route', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data === 'You have access to this route') {
          setHasAccess(true); // Berikan akses jika respon valid
        } else {
          navigate('/'); // Arahkan ke login jika respon tidak valid
        }
      } catch (error) {
        console.error('Access validation failed:', error);
        navigate('/'); // Arahkan ke login jika terjadi error
      }
    };

    checkAccess();
  }, [navigate]);

  if (!hasAccess) {
    return <p>Loading...</p>; // Tampilkan loading sementara akses dicek
  }

  return <>{children}</>; // Tampilkan komponen anak jika memiliki akses
};

export default ProtectedRoute;