import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { UserContext } from '../components/UserContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SummaryQuiz = () => {
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(5);
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

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizList.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(quizList.length / quizzesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(quizList.length / quizzesPerPage);
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        onClick={() => number !== '...' && paginate(number)}
        className={`page-item ${currentPage === number ? 'active' : ''}`}
        disabled={number === '...'}
      >
        {number}
      </button>
    ));
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
            <p className="text-center">There's no quizzes.</p>
          ) : (
            <>
              <table className="custom-quiz-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Quizzes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuizzes.map((quiz, index) => (
                    <tr key={quiz.id}>
                      <td>{indexOfFirstQuiz + index + 1}</td>
                      <td>{quiz.nama_course}: {quiz.nama_quiz}</td>
                      <td>
                        <button
                          className="btn-danger fw-bold"
                          onClick={() => handleResultClick(quiz.id_quiz, quiz.nama_quiz, quiz.nama_course)}
                        >
                          View Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={handlePrevPage}
                  className="page-item"
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </button>
                {renderPagination()}
                <button
                  onClick={handleNextPage}
                  className="page-item"
                  disabled={currentPage === Math.ceil(quizList.length / quizzesPerPage)}
                >
                  <FaChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryQuiz;