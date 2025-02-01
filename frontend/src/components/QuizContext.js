import { createContext, useContext, useState, useEffect } from "react";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const savedResults = JSON.parse(localStorage.getItem("quizResults")) || {};
  const [results, setResults] = useState(savedResults);

  useEffect(() => {
    if (results) {
      localStorage.setItem("quizResults", JSON.stringify(results));
    }
  }, [results]);

  return (
    <QuizContext.Provider value={{ results, setResults }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
