"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getAvailableCategories, getQuestionsByCategory } from "@/utils/questions";
import { 
  selectCategory, 
  subscribeToGame, 
  resetBuzz,
  startGameBoard,
  revealAnswer,
  addWrongAnswer,
  resetWrongAnswers,
  toggleWarning,
  updateWarningCountdown,
  transferPointsToTeam,
  nextQuestion,
  endGame,
  restartGame
} from "@/utils/firebaseUtils";
import "@/css/game.css";
import "@/css/board.css";

export default function HostGamePage() {
  const router = useRouter();
  const { gameCode, teams } = useSelector((state) => state.game);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [buzzedTeam, setBuzzedTeam] = useState(null);
  const [gamePhase, setGamePhase] = useState("category-selection"); // "category-selection" | "buzz" | "playing" | "finished"
  const [gameData, setGameData] = useState(null);
  const [warningInterval, setWarningInterval] = useState(null);

  useEffect(() => {
    if (!gameCode) {
      router.push("/home");
      return;
    }

    // Załaduj dostępne kategorie
    const availableCategories = getAvailableCategories();
    setCategories(availableCategories);

    // Nasłuchuj zmian w grze
    const unsubscribe = subscribeToGame(gameCode, (data) => {
      setGameData(data);
      
      if (data.selectedCategory && !selectedCategory) {
        setSelectedCategory(data.selectedCategory);
        
        // Załaduj pytania dla wybranej kategorii
        const categoryQuestions = getQuestionsByCategory(data.selectedCategory);
        setQuestions(categoryQuestions);
        
        if (categoryQuestions.length > 0) {
          const questionIndex = data.currentQuestionIndex || 0;
          setCurrentQuestion(categoryQuestions[questionIndex]);
        }
      }

      // Aktualizuj fazę gry
      if (data.gamePhase) {
        setGamePhase(data.gamePhase);
      }

      // Aktualizuj obecne pytanie przy zmianie indeksu
      if (data.currentQuestionIndex !== undefined && questions.length > 0) {
        setCurrentQuestion(questions[data.currentQuestionIndex]);
      }

      // Aktualizuj stan przycisku buzz
      if (data.buzzedTeamName) {
        setBuzzedTeam(data.buzzedTeamName);
      } else {
        setBuzzedTeam(null);
      }

      // Obsługa ostrzeżenia
      if (data.warningActive && !warningInterval) {
        handleWarningCountdown(data.warningCountdown || 3);
      } else if (!data.warningActive && warningInterval) {
        clearInterval(warningInterval);
        setWarningInterval(null);
      }
    });

    return () => {
      unsubscribe && unsubscribe();
      if (warningInterval) {
        clearInterval(warningInterval);
      }
    };
  }, [gameCode, router, selectedCategory, questions, warningInterval]);

  const handleSelectCategory = async (category) => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    
    try {
      await selectCategory(gameCode, category);
      console.log(`[HOST] Selected category: ${category}`);
    } catch (error) {
      console.error("[HOST] Error selecting category:", error);
      setIsSelecting(false);
    }
  };

  const handleResetBuzz = async () => {
    try {
      await resetBuzz(gameCode);
      console.log("[HOST] Buzz reset");
    } catch (error) {
      console.error("[HOST] Error resetting buzz:", error);
    }
  };

  const handleStartGameBoard = async () => {
    try {
      await startGameBoard(gameCode);
      console.log("[HOST] Game board started");
    } catch (error) {
      console.error("[HOST] Error starting game board:", error);
    }
  };

  const handleRevealAnswer = async (answer, points) => {
    try {
      const questionIndex = gameData?.currentQuestionIndex || 0;
      await revealAnswer(gameCode, answer, points, questionIndex);
      console.log(`[HOST] Revealed answer: ${answer} (${points} pts)`);
    } catch (error) {
      console.error("[HOST] Error revealing answer:", error);
    }
  };

  const handleWrongAnswer = async () => {
    try {
      await addWrongAnswer(gameCode);
      console.log("[HOST] Wrong answer added");
    } catch (error) {
      console.error("[HOST] Error adding wrong answer:", error);
    }
  };

  const handleResetWrong = async () => {
    try {
      await resetWrongAnswers(gameCode);
      console.log("[HOST] Wrong answers reset");
    } catch (error) {
      console.error("[HOST] Error resetting wrong answers:", error);
    }
  };

  const handleToggleWarning = async () => {
    try {
      const isActive = gameData?.warningActive || false;
      await toggleWarning(gameCode, !isActive);
      console.log(`[HOST] Warning ${!isActive ? "activated" : "deactivated"}`);
    } catch (error) {
      console.error("[HOST] Error toggling warning:", error);
    }
  };

  const handleWarningCountdown = async (startValue) => {
    let countdown = startValue;
    
    const interval = setInterval(async () => {
      if (countdown <= 0) {
        clearInterval(interval);
        setWarningInterval(null);
        await toggleWarning(gameCode, false);
        return;
      }
      
      await updateWarningCountdown(gameCode, countdown);
      countdown--;
    }, 1000);
    
    setWarningInterval(interval);
  };

  const handleTransferPoints = async (teamIndex) => {
    try {
      await transferPointsToTeam(gameCode, teamIndex);
      console.log(`[HOST] Points transferred to team ${teamIndex}`);
    } catch (error) {
      console.error("[HOST] Error transferring points:", error);
    }
  };

  const handleNextQuestion = async () => {
    try {
      await nextQuestion(gameCode);
      console.log("[HOST] Moved to next question");
    } catch (error) {
      console.error("[HOST] Error moving to next question:", error);
    }
  };

  const handleEndGame = async () => {
    try {
      await endGame(gameCode);
      console.log("[HOST] Game ended");
      router.push("/home");
    } catch (error) {
      console.error("[HOST] Error ending game:", error);
    }
  };

  const handleRestartGame = async () => {
    try {
      await restartGame(gameCode);
      console.log("[HOST] Game restarted");
      // Reset local state
      setSelectedCategory(null);
      setIsSelecting(false);
      setCurrentQuestion(null);
      setBuzzedTeam(null);
      setGamePhase("category-selection");
    } catch (error) {
      console.error("[HOST] Error restarting game:", error);
    }
  };

  const getDifficultyStars = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "⭐";
      case "medium":
        return "⭐⭐";
      case "hard":
        return "⭐⭐⭐";
      default:
        return "⭐";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Łatwy";
      case "medium":
        return "Średni";
      case "hard":
        return "Trudny";
      default:
        return difficulty;
    }
  };

  return (
    <div className="game-container">
      {/* Overlay ostrzeżenia */}
      {gameData?.warningActive && (
        <div className="warning-overlay">
          <div className="warning-countdown">{gameData.warningCountdown || 3}</div>
        </div>
      )}

      <div className="game-header">
        <h1>🎮 {
          gamePhase === "category-selection" ? "Wybierz zestaw pytań" :
          gamePhase === "buzz" ? `Pytanie ${(gameData?.currentQuestionIndex || 0) + 1}` :
          gamePhase === "playing" ? `Pytanie ${(gameData?.currentQuestionIndex || 0) + 1}` :
          "Podsumowanie"
        }</h1>
        <div className="game-code-badge">Kod gry: {gameCode}</div>
      </div>

      {gamePhase === "category-selection" ? (
        // FAZA 1: Wybór kategorii
        <div className="category-selection">
          <p className="instruction">Jako prowadzący, wybierz kategorię pytań dla tej gry:</p>
          
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`category-card ${selectedCategory === cat.category ? "selected" : ""}`}
                onClick={() => handleSelectCategory(cat.category)}
              >
                <div className="category-icon">{getDifficultyStars(cat.difficulty)}</div>
                <h3 className="category-name">{cat.category}</h3>
                <p className="category-difficulty">{getDifficultyLabel(cat.difficulty)}</p>
                <p className="category-info">5 pytań</p>
              </div>
            ))}
          </div>

          {selectedCategory && (
            <div className="selection-info">
              <p>✓ Wybrano: <strong>{selectedCategory}</strong></p>
              <p className="waiting-text">Ładowanie gry...</p>
            </div>
          )}
        </div>
      ) : gamePhase === "buzz" ? (
        // FAZA 2: Pytanie buzz
        <div className="buzz-round">
          <div className="host-question-card">
            <h2 className="question-text">{currentQuestion?.question}</h2>
            <p className="host-instruction">📢 Przeczytaj pytanie na głos drużynom</p>
          </div>

          <div className="buzz-status">
            {buzzedTeam ? (
              <div className="buzzed-info">
                <div className="buzzed-animation">⚡</div>
                <h3>Drużyna która wcisnęła pierwsza:</h3>
                <div className="team-name-display">{buzzedTeam}</div>
              </div>
            ) : (
              <div className="waiting-buzz">
                <div className="pulse-animation">⏱️</div>
                <p>Czekam na naciśnięcie przycisku przez drużyny...</p>
              </div>
            )}
          </div>

          <div className="buzz-controls">
            <button 
              className="btn-reset"
              onClick={handleResetBuzz}
            >
              🔄 Reset przycisku
            </button>
            {buzzedTeam && (
              <button className="btn-start-board" onClick={handleStartGameBoard}>
                ➡️ Przejdź do tablicy
              </button>
            )}
          </div>
        </div>
      ) : gamePhase === "playing" ? (
        // FAZA 3: Tablica z grą
        <div className="game-board">
          {/* Pytanie */}
          <div className="main-question-card">
            <h2 className="main-question-text">{currentQuestion?.question}</h2>
          </div>

          {/* Tablica z odpowiedziami i błędnymi po bokach */}
          <div className="board-with-wrong-answers">
            {/* 4 błędne po lewej */}
            <div className="wrong-answers-left">
              {Array.from({ length: Math.min(gameData?.wrongAnswersCount || 0, 4) }).map((_, i) => (
                <span key={i} className="wrong-x-large">✖</span>
              ))}
            </div>

            {/* Siatka odpowiedzi */}
            <div className="answers-grid">
              {currentQuestion?.answers.map((answer, index) => {
                const isRevealed = gameData?.revealedAnswers?.some(
                  (revealed) => revealed.answer === answer.answer
                );
                
                // Pokaż prawidłowe punkty (podwojone dla pytania 5)
                const questionIndex = gameData?.currentQuestionIndex || 0;
                const multiplier = questionIndex === 4 ? 2 : 1;
                const displayPoints = answer.points * multiplier;
                
                return (
                  <div
                    key={index}
                    className={`answer-card ${isRevealed ? "revealed" : ""}`}
                    onClick={() => !isRevealed && handleRevealAnswer(answer.answer, answer.points)}
                  >
                    <div className="answer-content">
                      <span className="answer-number">{index + 1}.</span>
                      <span className="answer-text">{answer.answer}</span>
                    </div>
                    <span className="answer-points">{displayPoints}</span>
                  </div>
                );
              })}
            </div>

            {/* 5-ta błędna po prawej */}
            <div className="wrong-answers-right">
              {(gameData?.wrongAnswersCount || 0) >= 5 && (
                <span className="wrong-x-large">✖</span>
              )}
            </div>
          </div>

          {/* Panel kontrolny */}
          <div className="host-controls">
            <div className="status-bar">
              <div className="status-item">
                <span className="status-label">Błędne odpowiedzi:</span>
                <span className="status-value"> {gameData?.wrongAnswersCount || 0}/5</span>
              </div>
              <div className="status-item">
                <span className="status-label">Punkty w rundzie:</span>
                <span className="status-value points">{gameData?.totalPoints || 0}</span>
              </div>
            </div>

            <div className="controls-section">
              <button className="control-btn btn-wrong" onClick={handleWrongAnswer}>
                ✖ Błędna odpowiedź
              </button>
              <button 
                className="control-btn btn-warning" 
                onClick={handleToggleWarning}
              >
                ⏰ {gameData?.warningActive ? "Zatrzymaj ostrzeżenie" : "Ostrzeżenie"}
              </button>
              <button className="control-btn btn-reset-wrong" onClick={handleResetWrong}>
                🔄 Reset błędnych
              </button>
            </div>

            <div className="controls-section">
              <button 
                className="control-btn btn-transfer" 
                onClick={() => handleTransferPoints(1)}
                disabled={
                  gameData?.pointsTransferred || 
                  !(gameData?.wrongAnswersCount >= 5 || 
                    gameData?.revealedAnswers?.length === currentQuestion?.answers?.length)
                }
              >
                🏆 Przekaż punkty - {gameData?.team1Name || "Drużyna 1"}
              </button>
              <button 
                className="control-btn btn-transfer" 
                onClick={() => handleTransferPoints(2)}
                disabled={
                  gameData?.pointsTransferred || 
                  !(gameData?.wrongAnswersCount >= 5 || 
                    gameData?.revealedAnswers?.length === currentQuestion?.answers?.length)
                }
              >
                🏆 Przekaż punkty - {gameData?.team2Name || "Drużyna 2"}
              </button>
            </div>

            <div className="controls-section">
              {(gameData?.currentQuestionIndex || 0) < 4 ? (
                <button 
                  className="control-btn btn-next-question" 
                  onClick={handleNextQuestion}
                  disabled={!gameData?.pointsTransferred}
                >
                  ➡️ Przejdź do następnego pytania
                </button>
              ) : (
                <button 
                  className="control-btn btn-summary" 
                  onClick={handleNextQuestion}
                  disabled={!gameData?.pointsTransferred}
                >
                  🏁 Przejdź do podsumowania
                </button>
              )}
            </div>
          </div>
        </div>
      ) : gamePhase === "finished" ? (
        // FAZA 4: Podsumowanie
        <div className="game-summary">
          {(() => {
            const team1Score = gameData?.team1Score || 0;
            const team2Score = gameData?.team2Score || 0;
            console.log(`[SUMMARY HOST] ====== GAME SUMMARY ======`);
            console.log(`[SUMMARY HOST] Full gameData:`, gameData);
            console.log(`[SUMMARY HOST] Final Scores - Team 1: ${team1Score}, Team 2: ${team2Score}`);
            console.log(`[SUMMARY HOST] Current question index: ${gameData?.currentQuestionIndex}`);
            console.log(`[SUMMARY HOST] Total points in round: ${gameData?.totalPoints || 0}`);
            console.log(`[SUMMARY HOST] ========================`);
            
            if (team1Score === team2Score) {
              return <h2 className="summary-title">🤝 Remis!</h2>;
            } else {
              return <h2 className="summary-title">🏁 Koniec Gry!</h2>;
            }
          })()}
          
          <div className="summary-scores">
            <div className={`team-score-card ${(gameData?.team1Score || 0) > (gameData?.team2Score || 0) ? "winner-team" : ""}`}>
              <span className="team-score-name">{gameData?.team1Name || "Drużyna 1"}</span>
              <span className="team-score-points">{gameData?.team1Score || 0}</span>
            </div>
            <div className={`team-score-card ${(gameData?.team2Score || 0) > (gameData?.team1Score || 0) ? "winner-team" : ""}`}>
              <span className="team-score-name">{gameData?.team2Name || "Drużyna 2"}</span>
              <span className="team-score-points">{gameData?.team2Score || 0}</span>
            </div>
          </div>

          <div className="summary-actions">
            <button className="control-btn btn-next-question" onClick={handleRestartGame}>
              🔄 Rozpocznij kolejną grę
            </button>
            <button className="control-btn btn-wrong" onClick={handleEndGame}>
              ❌ Zakończ grę
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
