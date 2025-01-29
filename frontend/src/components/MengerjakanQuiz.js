import React, { useState, useEffect, useContext, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api";
import Swal from "sweetalert2";
import { UserContext } from "../components/UserContext";

const MengerjakanQuiz = ({ quizData, onSubmitQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState((quizData?.duration || 0) * 60);
  const [startTime, setStartTime] = useState(null);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');

  // Format time into MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (quizData?.id_quiz) {
      fetchQuizData(quizData.id_quiz);
    }
  }, [quizData]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      Swal.fire({
        title: "Time is Up!",
        text: "Unfortunately the quiz time is over.",
        icon: "warning"
      }).then(() => {
        onSubmitQuiz(answers);
      });
    }
  }, [timeLeft, answers, onSubmitQuiz]);

  const fetchQuizData = async (id_quiz) => {
    setLoading(true);
    try {
      const soalResponse = await api.get(`/quizzes/${id_quiz}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const questionsData = soalResponse.data;
  
      const mappedQuestions = questionsData.pertanyaan.map((pertanyaan, index) => ({
        ...pertanyaan,
        id_pertanyaan: index + 1,
        jawaban: questionsData.jawaban[index] || [],
      }));
  
      setQuestions(mappedQuestions);
      console.log("Isi pertanyaan:", mappedQuestions);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  useEffect(() => {
    const startTime = new Date().toISOString();
    setStartTime(startTime);
  }, []);
  
  const calculateScore = (question, userAnswer) => {
    let score = 0;
    let correct = false;
  
    switch (question.jenis_pertanyaan) {
      case "pilihan_ganda":
        const correctOption = question.jawaban.find(
          (jawaban) => jawaban.status_jawaban === "benar"
        );

        if (correctOption?.nama_jawaban === userAnswer) {
          score = 25;
          correct = true;
        }
        break;
  
      case "jawaban_singkat":
        const correctShortAnswer = question.jawaban.find(
            (jawaban) => jawaban.status_jawaban === "benar"
          );
          if (
            correctShortAnswer?.konten_jawaban.toLowerCase() ===
            userAnswer.toLowerCase()
          ) {
            score = 40;
            correct = true;
          }
          break;
  
      case "operasi_matematika":
        const correctMathAnswer = question.jawaban.find(
            (jawaban) => jawaban.status_jawaban === "benar"
          );
          if (
            parseFloat(correctMathAnswer?.konten_jawaban) === parseFloat(userAnswer)
          ) {
            score = 35;
            correct = true;
          }
          break;
  
      default:
        break;
    }
    return { score, correct };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const unansweredQuestions = questions.filter(
      (question) => !answers[question.id_pertanyaan]
    );
  
    if (unansweredQuestions.length > 0) {
      Swal.fire({
        title: "Jawaban Tidak Lengkap!",
        text: "Harap menjawab semua pertanyaan sebelum mengirimkan kuis.",
        icon: "warning",
      });
      return;
    }
  
    try {
      setLoading(true);
      const hasil = [];
      let totalScore = 0;
      let correctCount = 0;
      const waktuMulai = new Date(startTime).toISOString(); 
      const waktuSelesai = new Date().toISOString();
  
      questions.forEach((question) => {
        const userAnswer = answers[question.id_pertanyaan];      
        const {score, correct} = calculateScore(question, userAnswer);
        totalScore += score;
        if (correct) correctCount++;
        hasil.push({
          id_pertanyaan: question.id_pertanyaan, // ID pertanyaan
          jawaban_user: userAnswer, // Jawaban pengguna
          nilai: score, // Skor untuk pertanyaan ini
          benar: correct, // Benar jika skornya lebih dari 0
        });
      });
      onSubmitQuiz({ hasil, nilai: totalScore, benar: correctCount });
  
      const historyPayload = {
        id_quiz: quizData.id_quiz,
        id_pelajar: user.userData.id_pelajar,
        waktu_mulai: waktuMulai,
        waktu_selesai: waktuSelesai,
        nilai: totalScore,
      };

      await api.put(
        `/history-quiz/${user.userData.id_pelajar}/${quizData.id_quiz}`,
        historyPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
      Swal.fire({
        title: "Terjadi Kesalahan!",
        text: "Gagal mengirimkan kuis, silakan coba lagi.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="quiz-container p-4"
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "8px",
        position: "relative",
      }}
    >
        <div className="countdown-timer">
            Waktu Tersisa: {formatTime(timeLeft)}
        </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={question.id_pertanyaan} className="mb-4 p-3 question-box">
            <h5><b>Soal {index + 1}</b></h5>
            <p>{question.konten_pertanyaan}</p>

            {question.jenis_pertanyaan === "pilihan_ganda" && (
              <div>
                {question.jawaban.map((option, optIndex) => (
                  <div className="form-check" key={optIndex}>
                    <input
                      type="radio"
                      id={question-`${question.id_pertanyaan}-option-${optIndex}`}
                      name={question-`${question.id_pertanyaan}`}
                      className="form-check-input custom-radio"
                      value={option.nama_jawaban}
                      checked={answers[question.id_pertanyaan] === option.nama_jawaban}
                      onChange={() =>
                        handleInputChange(question.id_pertanyaan, option.nama_jawaban)
                      }
                    />
                    <label
                      htmlFor={question-`${question.id_pertanyaan}-option-${optIndex}`}
                      className="form-check-label"
                    >
                      {option.konten_jawaban}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {question.jenis_pertanyaan === "jawaban_singkat" && (
              <input
                type="text"
                className="custom-input"
                placeholder="Answer"
                value={answers[question.id_pertanyaan] || ""}
                onChange={(e) =>
                  handleInputChange(question.id_pertanyaan, e.target.value)
                }
              />
            )}

            {/* Math Input */}
            {question.jenis_pertanyaan === "operasi_matematika" && (
              <input
                type="number"
                className="custom-input"
                placeholder="Answer"
                value={answers[question.id_pertanyaan] || ""}
                onChange={(e) =>
                  handleInputChange(question.id_pertanyaan, e.target.value)
                }
              />
            )}
          </div>
        ))}
        <div className="submit-container">
            <button type="submit" className="custom-btn">
            SUBMIT
            </button>
        </div>
      </form>
    </div>
  );
};

export default MengerjakanQuiz;