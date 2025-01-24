import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DetailSummaryQuiz = () => {
    const location = useLocation();
    const { id } = useParams();
    const { quizName, courseName } = location.state || {};
    const [resultsList, setResultsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(5);
    const token = localStorage.getItem('token');

    const fetchResultsList = async () => {
        try {
            const response = await api.get(`/detail-history-quiz/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResultsList(response.data);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            Swal.fire('Error', 'Failed to fetch quiz results. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResultsList();
    }, []);

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = resultsList.slice(indexOfFirstResult, indexOfLastResult);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(resultsList.length / resultsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(resultsList.length / resultsPerPage);
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

    const renderIcon = (detail, type) => {
        const item = detail.find(d => d.jenis_pertanyaan === type);
        if (!item) return null;
        return item.status === 'benar' ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>;
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container-fluid py-4">
            <div className="container-dashboard">
                <h3 className="greeting-title">Summary Quiz</h3>
                <div className="dashboard-flex">
                    <h3 className="courses-title">{courseName}: {quizName}</h3>
                </div>
                <div className="quiz-table">
                    {resultsList.length === 0 ? (
                        <p className="text-center">There's no quizzes result.</p>
                    ) : (
                        <>
                            <table className="custom-result-table">
                                <thead className="table-gray">
                                    <tr>
                                        <th>No</th>
                                        <th>Student Name</th>
                                        <th>Total Grades</th>
                                        <th>Q: Pilihan Ganda<br /><span className="points">(25 points)</span></th>
                                        <th>Q: Jawaban Singkat<br /><span className="points">(40 points)</span></th>
                                        <th>Q: Operasi Matematika<br /><span className="points">(35 points)</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentResults.map((result, index) => (
                                        <tr key={result.id}>
                                            <td>{indexOfFirstResult + index + 1}</td>
                                            <td>{result.student_name}</td>
                                            <td>{result.nilai}</td>
                                            <td>{renderIcon(result.detail, 'pilihan_ganda')}</td>
                                            <td>{renderIcon(result.detail, 'jawaban_singkat')}</td>
                                            <td>{renderIcon(result.detail, 'operasi_matematika')}</td>
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
                                    disabled={currentPage === Math.ceil(resultsList.length / resultsPerPage)}
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

export default DetailSummaryQuiz;