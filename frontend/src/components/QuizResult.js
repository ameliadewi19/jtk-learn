import React from "react";

const QuizResult = ({ quizData, totalScore, correctAnswers, onRetakeQuiz, onReview}) => {
    const isPerfectScore = totalScore === 100;

  return (
    <div className="quiz-guide-box position-relative p-4 w-100"
        style={{ maxWidth: "1300px" }}
    >
        <div className="position-absolute quiz-title">
            <h3><b>{quizData.name}</b></h3>
        </div>
        <div className="start-quiz-container custom-quiz-guide">
            <h3>Quiz Result</h3>
            <p>You got {correctAnswers} out of 3 correct: {totalScore}%</p>
            {isPerfectScore? (
                <p className="passed-quiz">You passed!</p>
            ):(
                <p className="notpass-quiz">You did not pass.</p>
            )}
            <p>100% required for passing grade</p>
            {isPerfectScore? (
                <p>Excellent! You've passed the quiz. Keep up the great work!</p>
            ):(
                <p>Review learning materials and try again!</p>
            )}
            <div className="submit-container"
                style={{display: "flex", gap: "10px"}}
            >
                {isPerfectScore? (
                    <button className="custom-btn" onClick={onReview}>
                        Review All Question Results
                    </button>
                ):(
                    <>
                        <button className="custom-btn" onClick={onRetakeQuiz}>
                            Retake Quiz
                        </button>
                        <button className="custom-btn" onClick={onReview}>
                            Review All Question Results
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default QuizResult;
