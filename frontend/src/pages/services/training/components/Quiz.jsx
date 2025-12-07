import React, { useState } from "react";
import "../training.css";

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
  const [showQuiz, setShowQuiz] = useState(false);
  const [greenCoins, setGreenCoins] = useState(0);

  const handleQuizAnswer = (answer) => {
    let newScore = score;
    if (answer === quizQuestions[quizStep].a) newScore += 1;

    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep("done");
      setGreenCoins(newScore * 10); // 10 coins per right answer
    }
    setScore(newScore);
  };

  return (
    <div>
      <h2 className="section-heading">Quick Quiz</h2>

      {!showQuiz ? (
        <button className="start-quiz-btn" onClick={() => setShowQuiz(true)}>
          Start Quiz
        </button>
      ) : (
        <div className="quiz-box">
          {quizStep === "done" ? (
            <div className="quiz-result">
              <h3>Quiz Completed! 🎉</h3>
              <p>Your Score: {score} / {quizQuestions.length}</p>
              <p>GreenCoins Earned: {greenCoins} 🪙</p>
            </div>
          ) : (
            <>
              <p className="quiz-question">{quizQuestions[quizStep].q}</p>
              <div className="quiz-options">
                <button onClick={() => handleQuizAnswer("Yes")}>Yes</button>
                <button onClick={() => handleQuizAnswer("No")}>No</button>
                <button onClick={() => handleQuizAnswer("Wet Waste")}>Wet Waste</button>
                <button onClick={() => handleQuizAnswer("Dry Waste")}>Dry Waste</button>
                <button onClick={() => handleQuizAnswer("Hazardous Waste")}>Hazardous Waste</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
