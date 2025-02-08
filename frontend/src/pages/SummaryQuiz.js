import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { UserContext } from '../components/UserContext';

const SummaryQuiz = () => {
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchQuizList = async () => {
    try {
      const response = await api.get(`/quizzes/pengajar/${user.userData.kode_dosen}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizList(response.data);
    }
    catch (error) {
      console.error('Error fetching quizzes:', error);
      Swal.fire('Error', 'Failed to fetch quizzes. Please try again later.', 'error');
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuizList();
  }, []);

  const handleResultClick = (id, quizName, courseName) => {
    navigate(`/summary-quiz/${id}`, { state: { quizName, courseName } });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="container-dashboard">
        <div className="dashboard-flex">
          <h3 className="courses-title">Summary Quiz</h3>
        </div>
        <div className="quiz-table">
          {quizList.length === 0 ? (
            <p className="text-center">No quiz has been created yet</p>
          ) : (
            <table className="custom-quiz-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Quizzes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizList.map((quiz, index) => (
                  <tr key={quiz.id}>
                    <td>{index + 1}</td>
                    <td>{quiz.nama_course}: {quiz.nama_quiz}</td>
                    <td className="result-column">
                      <button
                        className="result-button"
                        onClick={() => handleResultClick(quiz.id_quiz, quiz.nama_quiz, quiz.nama_course)}
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryQuiz;