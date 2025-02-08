import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../components/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const HistoryQuiz = () => {
  const [historyQuizList, setHistoryQuizList] = useState([]);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAllHistoryQuiz = async () => {
    try {
      const response = await api.get(
        `/history-quiz/${user.userData.id_pelajar}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      const mappedHistoryQuiz = response.data.map((historyQuiz) => ({
        id: historyQuiz.id_history_quiz,
        id_quiz: historyQuiz.id_quiz,
        courseName: historyQuiz.nama_course,
        title: historyQuiz.nama_quiz,
        description: historyQuiz.deskripsi_quiz,
        waktuMulai: historyQuiz.waktu_mulai,
        waktuSelesai: historyQuiz.waktu_selesai,
        nilai: historyQuiz.nilai,
        id_course: historyQuiz.id_course,
      }));
      console.log(mappedHistoryQuiz);
      setHistoryQuizList(mappedHistoryQuiz);
    } catch (error) {
      console.error("Error fetching history quiz:", error);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleClickDetail = async (id_course, id_quiz) => {
    navigate(`/learn-course/${id_course}?id_quiz=${id_quiz}`);
};

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
        <div className="row row-custom-gap2">
          {historyQuizList.length > 0 ? (
            historyQuizList.map((quiz) => (
              <div key={quiz.id} className="col-12 col-sm-5 col-lg-4">
                <div className="history-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {quiz.courseName}: {quiz.title}
                    </h5>
                    <div className="card-description">
                      <p className="card-text">{quiz.description}</p>
                    </div>
                    <div className="card-dates">
                      <p className="card-text">
                        Waktu Mulai: {formatDate(new Date(quiz.waktuMulai))}
                      </p>
                      <p className="card-text">
                        Waktu Selesai: {formatDate(new Date(quiz.waktuSelesai))}
                      </p>
                    </div>
                    <div className="card-score">
                      <p className="card-text">Highest Score: {quiz.nilai}</p>
                    </div>
                    <button
                      className="detail-course-button"
                      onClick={() =>
                        handleClickDetail(quiz.id_course, quiz.id_quiz)
                      }
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "20px", textAlign: "center" }}>
              No quizzes have been completed yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryQuiz;