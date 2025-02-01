import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api";
import Swal from "sweetalert2";
import { UserContext } from "./UserContext";
import { useQuiz } from "./QuizContext";

const MengerjakanQuiz = ({ quizData, onSubmitQuiz, isReviewMode, onBackToQuizResult }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [correctAnswersMap, setCorrectAnswersMap] = useState({});
  const { results, setResults } = useQuiz();
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

  useEffect(() => {
    const fetchHistoryDetails = async () => {
      if (isReviewMode && quizData?.id_history_quiz) {
        try {
          const response = await api.get(`/detail-history-quiz/${quizData.id_history_quiz}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const mappedResults = response.data.reduce((acc, detail) => {
            acc[detail.id_pertanyaan] = detail.id_jawaban || detail.jawaban_text || "";
            return acc;
          }, {});
  
          setResults(mappedResults);
          console.log("Jawaban dari history:", mappedResults);
        } catch (error) {
          console.error("Error fetching history details:", error);
        }
      }
    };
  
    fetchHistoryDetails();
  }, [isReviewMode, quizData?.id_history_quiz, token]);

  useEffect(() => {
    const fetchAnswersdb = async () => {
      console.log("Fetching answersdb...");
      try {
        const response = await api.get("/answers/", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const correctMap = response.data.reduce((acc, answer) => {
          if (!acc[answer.id_pertanyaan]) {
            acc[answer.id_pertanyaan] = [];
          }
          acc[answer.id_pertanyaan].push({
            id_jawaban: answer.id_jawaban,
            konten_jawaban: answer.konten_jawaban
          });
          return acc;
        }, {});        
  
        console.log("Correct Answers Map:", correctMap);
        setCorrectAnswersMap(correctMap);
      } catch (err) {
        console.error("Error fetching answers:", err);
      }
    };
  
    if (token) {
      fetchAnswersdb();
    }
  }, [token]);  
  
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
  
      for (const question of questions) {
        const userAnswer = answers[question.id_pertanyaan];
        const { score, correct } = calculateScore(question, userAnswer);
        totalScore += score;
        if (correct) correctCount++;
  
        hasil.push({
          id_pertanyaan: question.id_pertanyaan,
          jawaban_user: userAnswer,
          nilai: score,
          benar: correct,
        });
      }

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

      const historyResponse = 
        await api.get(`/history-quiz/${user.userData.id_pelajar}/${quizData.id_quiz}/${totalScore}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      
  
      const id_history_quiz = historyResponse.data.id_history_quiz;
      quizData.id_history_quiz = id_history_quiz;
  
      if (!id_history_quiz) {
        throw new Error("Gagal mendapatkan id_history_quiz.");
      }
  
      for (const question of questions) {
        const userAnswer = answers[question.id_pertanyaan];
        const { score, correct } = calculateScore(question, userAnswer);
  
        const selectedAnswer = question.jawaban.find(
          (jawaban) => jawaban.nama_jawaban === userAnswer
        );
  
        const detailHistoryPayload = {
          id_history_quiz: id_history_quiz,
          id_pertanyaan: question.id_pertanyaan,
          id_jawaban: selectedAnswer ? selectedAnswer.id_jawaban : null,
          jawaban_text: question.jenis_pertanyaan !== "pilihan_ganda" ? userAnswer : null,
          status: correct ? "benar" : "salah",
        };
  
        await api.put("/detail-history-quiz/detail", detailHistoryPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      onSubmitQuiz({ hasil, nilai: totalScore, benar: correctCount });
  
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

  if(isReviewMode){
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

      <form>
        {questions.map((question, index) => {
          const correctAnswers = correctAnswersMap[question.id_pertanyaan] || [];
          const correctAnswerIds = correctAnswers.map(answer => answer.id_jawaban);
          const correctAnswerCon = correctAnswers.map(answer => answer.konten_jawaban);
          const userAnswers = results[question.id_pertanyaan] || [];
          console.log("isi userAnswers:", userAnswers);
          return (
            <div
              key={question.id_pertanyaan}
              className={`mb-4 p-3 question-box`}
            >
              <h5><b>Soal {index + 1}</b></h5>
              <p>{question.konten_pertanyaan}</p>

              {question.jenis_pertanyaan === "pilihan_ganda" && (
                <div>
                  {question.jawaban.map((option, optIndex) => {
                    const isCorrect = correctAnswerIds.includes(option.id_jawaban);
                    const isUserAnswer = userAnswers === option.id_jawaban;
                    const isIncorrect = isUserAnswer && !isCorrect; // Cek apakah jawaban pengguna salah

                    return (
                      <div
                        key={optIndex}
                        className={`form-check ${isCorrect ? "border-success" : ""} ${isIncorrect ? "border-unsuccess" : ""}`}
                      >
                        <input
                          type="radio"
                          id={`question-${question.id_pertanyaan}-option-${optIndex}`}
                          name={`question-${question.id_pertanyaan}`}
                          className="form-check-input custom-radio"
                          value={option.id_jawaban}
                          checked={isUserAnswer}
                          disabled
                        />
                        <div className="d-flex justify-content-between align-items-center">
                          <label
                            htmlFor={`question-${question.id_pertanyaan}-option-${optIndex}`}
                            className="form-check-label"
                          >
                            {option.konten_jawaban}
                          </label>

                          {isUserAnswer && isCorrect && (
                            <span className="ms-2 text-end d-block">
                              <span style={{ color: "black" }}>Your Answer:</span> 
                              <span className="text-success"> Correct</span>
                            </span>
                          )}

                          {isIncorrect && (
                            <span className="ms-2 text-end d-block">
                              <span style={{ color: "black" }}>Your Answer:</span> 
                              <span className="text-unsuccess"> Incorrect</span>
                            </span>
                          )}

                          {isCorrect && !isUserAnswer && (
                            <span className="ms-2 text-end d-block">
                              <span style={{ color: "black" }}>Correct Answer</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}


              {question.jenis_pertanyaan === "jawaban_singkat" && (
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Answer"
                    value={userAnswers}
                    disabled
                  />
                  {correctAnswerCon.includes(userAnswers)? (
                    <span className="ms-3">
                      <span style={{ color: "black" }}>Your Answer:</span> 
                      <span className="text-success"> Correct</span>
                    </span>
                  ):(
                    <>
                      <span className="ms-3">
                        <span style={{ color: "black"}}>Your Answer:</span> 
                        <span className="text-unsuccess"> Incorrect</span>
                      </span>
                      <span className="ms-5">
                        <span style={{ color: "black" }}>Correct Answer: {correctAnswerCon.join(", ")}</span> 
                      </span>
                    </>
                  )}
                </div>
              )}

              {question.jenis_pertanyaan === "operasi_matematika" && (
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="Answer"
                    value={userAnswers}
                    disabled
                  />
                  {correctAnswerCon.includes(userAnswers)? (
                    <span className="ms-3">
                      <span style={{ color: "black" }}>Your Answer:</span> 
                      <span className="text-success"> Correct</span>
                    </span>
                  ):(
                    <>
                      <span className="ms-3">
                        <span style={{ color: "black", gap:"5px" }}>Your Answer:</span> 
                        <span className="text-unsuccess"> Incorrect</span>
                      </span>
                      <span className="ms-5">
                        <span style={{ color: "black" }}>Correct Answer: {correctAnswerCon.join(", ")}</span> 
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div className="submit-container">
          <button className="custom-btn" onClick={onBackToQuizResult}>
            See Result
          </button>
        </div>
      </form>
    </div>
  );
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