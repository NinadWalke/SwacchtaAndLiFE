import React, { useState } from "react";
import "../training.css";
import api from "../../../../utils/axiosConfig";
import {useAuth} from "../../../../components/AuthContext";

export default function Quiz() {
  const quizQuestions = [
    { q: "Which bin does plastic go into?", a: "Dry Waste" },
    { q: "Is food leftover wet waste?", a: "Yes" },
    { q: "Where should batteries be disposed?", a: "Hazardous Waste" },
    { q: "Can medical waste be mixed with dry waste?", a: "No" },
    { q: "Is glass recyclable?", a: "Yes" }
  ];

  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [greenCoins, setGreenCoins] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const {user} = useAuth();

  const handleQuizAnswer = async (answer) => {
    let newScore = score;
    if (answer === quizQuestions[quizStep].a) newScore += 1;

    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep("done");
      await api.post("/training/quiz", {points: newScore * 10, userId: user._id});
      setGreenCoins(newScore * 10);
    }
    setScore(newScore);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setScore(0);
    setShowQuiz(false);
    setGreenCoins(0);
  };

  return (
    <section className="gs-training-section">
      <h2 className="gs-training-section-heading">Quick Quiz</h2>

      {!showQuiz ? (
        <button 
          className="gs-training-quiz-start-btn" 
          onClick={() => setShowQuiz(true)}
        >
          Start Quiz
        </button>
      ) : (
        <div className="gs-training-quiz-box">
          {quizStep === "done" ? (
            <div className="gs-training-quiz-result">
              <h3 className="gs-training-quiz-result__title">Quiz Completed! 🎉</h3>
              <p className="gs-training-quiz-result__score">
                Your Score: {score} / {quizQuestions.length}
              </p>
              <p className="gs-training-quiz-result__coins">
                GreenCoins Earned: {greenCoins} 🪙
              </p>
              <button 
                className="gs-training-quiz-restart-btn" 
                onClick={resetQuiz}
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <>
              <p className="gs-training-quiz-question">
                {quizQuestions[quizStep].q}
              </p>
              <div className="gs-training-quiz-options">
                <button 
                  className="gs-training-quiz-option-btn"
                  onClick={() => handleQuizAnswer("Yes")}
                >
                  Yes
                </button>
                <button 
                  className="gs-training-quiz-option-btn"
                  onClick={() => handleQuizAnswer("No")}
                >
                  No
                </button>
                <button 
                  className="gs-training-quiz-option-btn"
                  onClick={() => handleQuizAnswer("Wet Waste")}
                >
                  Wet Waste
                </button>
                <button 
                  className="gs-training-quiz-option-btn"
                  onClick={() => handleQuizAnswer("Dry Waste")}
                >
                  Dry Waste
                </button>
                <button 
                  className="gs-training-quiz-option-btn"
                  onClick={() => handleQuizAnswer("Hazardous Waste")}
                >
                  Hazardous Waste
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}