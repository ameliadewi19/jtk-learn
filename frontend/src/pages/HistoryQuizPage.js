import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../components/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const HistoryQuiz = () => {
    const [historyQuizList, setHistoryQuizList] = useState([]);
    const { user } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchAllHistoryQuiz = async () => {
        try {
            const response = await api.get(`/history-quiz/${user.userData.id_pelajar}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const mappedHistoryQuiz = response.data.map((historyQuiz) => ({
                id: historyQuiz.id_history_quiz,
                courseName: historyQuiz.nama_course,
                title: historyQuiz.nama_quiz,
                description: historyQuiz.deskripsi_quiz,
                waktuMulai: historyQuiz.waktu_mulai,
                waktuSelesai: historyQuiz.waktu_selesai,
                nilai: historyQuiz.nilai,
            }));
            setHistoryQuizList(mappedHistoryQuiz);
        } catch (error) {
            console.error('Error fetching history quiz:', error);
        }
    }

    useEffect(() => {
        fetchAllHistoryQuiz();
    }, []);


    return (
        <div className="container-fluid py-4">
            <div className="container-dashboard">
                <h3 className="greeting-title">Hi, {user.userData.nama}!</h3>
                <div className="dashboard-flex">
                    <h3 className="courses-title">History Quiz</h3>
                </div>
                    {historyQuizList.length > 0 ? (
                        <ul>
                            {historyQuizList.map((quiz) => (
                                <li key={quiz.id}>
                                    <h2>{quiz.title}</h2>
                                    <p>
                                        <strong>Course:</strong> {quiz.courseName}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {quiz.description}
                                    </p>
                                    <p>
                                        <strong>Start Time:</strong> {new Date(quiz.waktuMulai).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>End Time:</strong> {new Date(quiz.waktuSelesai).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Score:</strong> {quiz.nilai}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Belum ada quiz yang diselesaikan</p>
                    )}
                </div>
            </div>
    );
};

export default HistoryQuiz;