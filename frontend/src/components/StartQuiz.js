import React from "react";

const StartQuiz = ({ quizData, onStartQuiz }) => {
  return (
    <div className="quiz-guide-box position-relative p-4 w-100"
        style={{ maxWidth: "1300px" }}
    >
        <div className="position-absolute quiz-title">
            <h3><b>{quizData.name}</b></h3>
        </div>
        <div className="start-quiz-container custom-quiz-guide">
            <h3>Quiz</h3>
            <p>Duration: {quizData.duration} minutes</p>
            <p>{quizData.desc}</p>
            <p>
                Review the materials before starting. Good luck!
            </p>
            <div className="submit-container">
                <button className="custom-btn" onClick={onStartQuiz}>
                    Start Quiz
                </button>
            </div>
        </div>
    </div>
  );
};

export default StartQuiz;
