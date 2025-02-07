import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../services/api';

const DetailSummaryQuiz = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const { quizName, courseName } = state || {};
    const [resultsList, setResultsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchResultsList = async () => {
            try {
                const response = await api.get(`/detail-history-quiz/data/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setResultsList(response.data);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
                Swal.fire('Error', 'Failed to fetch quiz results. Please try again later.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchResultsList();
    }, [id, token]);

    const sortedResults = [...resultsList].sort((a, b) =>
        sortOrder === 'asc'
            ? a.student_name.localeCompare(b.student_name)
            : b.student_name.localeCompare(a.student_name)
    );

    const renderIcon = (detail, type) => {
        const item = detail.find(d => d.jenis_pertanyaan === type);
        if (!item) return null;
        return item.status === 'benar' ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>;
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container-fluid py-4">
            <div className="container-dashboard">
                <h3 className="greeting-title">Summary Quiz</h3>
                <div className="dashboard-flex">
                    <h3 className="courses-title">{courseName}: {quizName}</h3>
                </div>
                <div className="quiz-table">
                    {resultsList.length > 0 ? (
                        <>
                            <div className="sort-select">
                                <label htmlFor="sort">Student Name</label>
                                <select className='custom-select' id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="asc">A-Z</option>
                                    <option value="desc">Z-A</option>
                                </select>
                            </div>
                            <table className="custom-result-table">
                                <thead className="table-gray">
                                    <tr>
                                        <th>No</th>
                                        <th>Student Name</th>
                                        <th>Grade</th>
                                        <th>Q1<br /><span className="points">(25 points)</span></th>
                                        <th>Q2<br /><span className="points">(40 points)</span></th>
                                        <th>Q3<br /><span className="points">(35 points)</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedResults.map((result, index) => (
                                        <tr key={result.id}>
                                            <td>{index + 1}</td>
                                            <td>{result.student_name}</td>
                                            <td>{result.nilai}</td>
                                            <td>{renderIcon(result.detail, 'pilihan_ganda')}</td>
                                            <td>{renderIcon(result.detail, 'jawaban_singkat')}</td>
                                            <td>{renderIcon(result.detail, 'operasi_matematika')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p className="text-center">No students have taken the quiz yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailSummaryQuiz;