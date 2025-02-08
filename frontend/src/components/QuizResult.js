import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { UserContext } from "../components/UserContext";
import SidebarPelajar from "../components/SidebarPelajar";

const QuizResult = ({
  handleRetakeQuiz,
  handleReview,
  totalScore,
  correctAnswers,
}) => {
  const { id } = useParams(); // Ambil ID dari URL
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [nilaiTotal, setNilaiTotal] = useState(totalScore);

  const [quizResult, setQuizResult] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [activeMateri, setActiveMateri] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [isPerfectScore, setIsPerfectScore] = useState(totalScore === 100);

  const fetchDetailQuiz = async () => {
    if (totalScore == undefined) {
      const response = await api.get(
        `/detail-history-quiz/${user.userData.id_pelajar}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status == 200) {
        console.log(response.data[0]);
        setNilaiTotal(response.data[0].nilai);
        let perfect = response.data[0].nilai === 100;
        setIsPerfectScore(perfect)
      }
    }
  };

  useEffect(() => {
    return () => {
      fetchDetailQuiz();
    };
  }, []);

  return (
    <div
      className="container-fluid d-flex"
      style={{ padding: "0px", height: "100vh" }}
    >
      <div
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{ position: "relative" }}
      >
        <div
          className="quiz-guide-box position-relative p-4 w-100"
          style={{ maxWidth: "1300px" }}
        >
          <div className="position-absolute quiz-title">
            <h3>
              <b>{quizName}</b>
            </h3>
          </div>
          <div className="start-quiz-container custom-quiz-guide">
            <h3>Quiz Result</h3>
            <p>
              You got {correctAnswers} out of 3 correct: {nilaiTotal}%
            </p>
            {isPerfectScore ? (
              <p className="passed-quiz">You passed!</p>
            ) : (
              <p className="notpass-quiz">You did not pass.</p>
            )}
            <p>100% required for passing grade</p>
            {isPerfectScore ? (
              <p>Excellent! You've passed the quiz. Keep up the great work!</p>
            ) : (
              <p>Review learning materials and try again!</p>
            )}
            <div
              className="submit-container"
              style={{ display: "flex", gap: "10px" }}
            >
              {isPerfectScore ? (
                <button className="custom-btn" onClick={handleReview}>
                  Review All Question Results
                </button>
              ) : (
                <>
                  <button
                    className="custom-btn"
                    onClick={() => handleRetakeQuiz(id)} // Call the prop function
                  >
                    Retake Quiz
                  </button>
                  <button className="custom-btn" onClick={handleReview}>
                    Review All Question Results
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
