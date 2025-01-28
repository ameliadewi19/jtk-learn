import React, { useState, useEffect, useContext, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api";
import Swal from "sweetalert2";
import { UserContext } from "../components/UserContext";

const MengerjakanQuiz = ({ quizData, onSubmitQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answerdb, setAnswerdb] = useState([]);
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
      const soalResponse = await api.get(`/quizzes/${id_quiz}/pertanyaan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const questionsData = soalResponse.data;

      const combinedQuestions = await Promise.all(
        questionsData.map(async (question) => {
          const pertanyaanKe = 1;
          const jawabanResponse = await api.get(
            `/quizzes/${pertanyaanKe}/jawaban`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
          const answersData = jawabanResponse.data;
          setAnswerdb(answersData);
          
          return {
            ...question,
            options: answersData.map((answer) => answer.konten_jawaban),
          };
        })
      );
      setQuestions(combinedQuestions);
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
  
    switch (question.jenis_pertanyaan) {
      case "pilihan_ganda":
        const correctOption = answerdb.find(
          (option) => option.status_jawaban === "benar"
        );

        console.log('apa coba correctOptionnya:', correctOption)

        if (correctOption?.konten_jawaban === userAnswer) {
          score = 25;
        }
        console.log('score saat ini:', score)
        break;
  
      case "jawaban_singkat":
        if (answerdb.konten_jawaban.toLowerCase() === userAnswer.toLowerCase()) {
          score = 40;
        }
        break;
  
      case "operasi_matematika":
        if (parseFloat(answerdb.konten_jawaban) === parseFloat(userAnswer)) {
          score = 35;
        }
        break;
  
      default:
        break;
    }
  
    return score;
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
  
      // Waktu mulai dan selesai kuis
      const waktuMulai = new Date(startTime).toISOString(); 
      const waktuSelesai = new Date().toISOString();
  
      const filteredQuestions = questions.filter(
        (question) => question.id_pertanyaan === 1
      );

      console.log('isi filteredQuestions:', filteredQuestions)

      filteredQuestions.forEach((question) => {
        const userAnswer = answers[question.id_pertanyaan];
        console.log('isi userAnswer:', userAnswer)
        
        const questionScore = calculateScore(question, userAnswer);
  
        totalScore += questionScore;
  
        hasil.push({
          id_pertanyaan: question.id_pertanyaan,
          jawaban_user: userAnswer,
          nilai: questionScore,
          benar: questionScore > 0,
        });
      });  
  
      // Simpan hasil kuis (PUT atau POST)
      const historyPayload = {
        id_quiz: quizData.id_quiz,
        id_pelajar: user.userData.id_pelajar,
        waktu_mulai: waktuMulai,
        waktu_selesai: waktuSelesai,
        nilai: totalScore,
      };
  
      console.log("Payload being sent:", historyPayload);

      await api.put(
        `/quizzes/${user.userData.id_pelajar}/${quizData.id_quiz}`,
        historyPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Tampilkan skor kepada pengguna
      Swal.fire({
        title: "Quiz Selesai!",
        text: `Skor Anda: ${totalScore}`,
        icon: "success",
      });
  
      // Kirim hasil ke parent jika diperlukan
      onSubmitQuiz(hasil);
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
                {question.options.map((option, optIndex) => (
                  <div className="form-check" key={optIndex}>
                    <input
                      type="radio"
                      id={`question-${question.id_pertanyaan}-option-${optIndex}`}
                      name={`question-${question.id_pertanyaan}`}
                      className="form-check-input custom-radio"
                      value={option}
                      checked={answers[question.id_pertanyaan] === option}
                      onChange={() =>
                        handleInputChange(question.id_pertanyaan, option)
                      }
                    />
                    <label
                      htmlFor={`question-${question.id_pertanyaan}-option-${optIndex}`}
                      className="form-check-label"
                    >
                      {option}
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
