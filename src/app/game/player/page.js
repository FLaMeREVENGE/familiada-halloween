"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getAvailableCategories, getQuestionsByCategory } from "@/utils/questions";
import { subscribeToGame, buzzIn } from "@/utils/firebaseUtils";
import "@/css/game.css";
import "@/css/board.css";

export default function PlayerGamePage() {
  const router = useRouter();
  const { gameCode, userName, userId } = useSelector((state) => state.game);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [buzzedTeam, setBuzzedTeam] = useState(null);
  const [myTeamBuzzed, setMyTeamBuzzed] = useState(false);
  const [isFirst, setIsFirst] = useState(null); // true = first, false = second, null = not buzzed
  const [gamePhase, setGamePhase] = useState("category-selection"); // "category-selection" | "buzz" | "playing" | "finished"
  const [gameData, setGameData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [myTeamNumber, setMyTeamNumber] = useState(null); // 1 lub 2

  useEffect(() => {
    if (!gameCode) {
      router.push("/home");
      return;
    }

    // Załaduj dostępne kategorie
    const availableCategories = getAvailableCategories();
    setCategories(availableCategories);

    // Nasłuchuj na wybór kategorii przez hosta
    const unsubscribe = subscribeToGame(gameCode, (data) => {
      setGameData(data);
      
      // Jeśli gra została zakończona, przekieruj do home
      if (data.status === 'ended') {
        router.push("/home");
        return;
      }
      
      // Określ numer zespołu gracza
      if (data.teams && !myTeamNumber) {
        const teamIndex = data.teams.findIndex(team => team.id === userId);
        if (teamIndex !== -1) {
          setMyTeamNumber(teamIndex + 1); // 1 lub 2
        }
      }
      
      if (data.selectedCategory && !selectedCategory) {
        setSelectedCategory(data.selectedCategory);
        console.log(`[PLAYER] Host selected category: ${data.selectedCategory}`);
        
        // Załaduj pytania
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
        
        // Sprawdź czy to moja drużyna wcisnęła
        if (data.buzzedTeam === userId) {
          setMyTeamBuzzed(true);
          setIsFirst(true);
        } else if (myTeamBuzzed && data.buzzedTeam !== userId) {
          setIsFirst(false);
        }
      } else {
        // Reset
        setBuzzedTeam(null);
        setMyTeamBuzzed(false);
        setIsFirst(null);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [gameCode, router, selectedCategory, userId, myTeamBuzzed, questions]);

  const handleBuzz = async () => {
    if (myTeamBuzzed || buzzedTeam) return; // Już wciśnięty
    
    setMyTeamBuzzed(true);
    
    try {
      const result = await buzzIn(gameCode, userId, userName);
      if (result.first) {
        setIsFirst(true);
        console.log(`[PLAYER] We buzzed first!`);
      } else {
        setIsFirst(false);
        console.log(`[PLAYER] We were too slow`);
      }
    } catch (error) {
      console.error("[PLAYER] Error buzzing:", error);
      setMyTeamBuzzed(false);
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
          gamePhase === "category-selection" ? "Oczekiwanie na wybór zestawu" :
          gamePhase === "buzz" ? `Pytanie ${(gameData?.currentQuestionIndex || 0) + 1}` :
          gamePhase === "playing" ? `Pytanie ${(gameData?.currentQuestionIndex || 0) + 1}` :
          "Podsumowanie"
        }</h1>
        <div className="game-info">
          <span className="game-code-badge">Kod gry: {gameCode}</span>
          <span className="team-badge">Drużyna: {userName}</span>
        </div>
      </div>

      {gamePhase === "category-selection" ? (
        // FAZA 1: Wybór kategorii
        <div className="category-selection">
          <p className="instruction">Prowadzący wybiera zestaw pytań...</p>
          
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`category-card ${selectedCategory === cat.category ? "selected" : ""} readonly`}
              >
                <div className="category-icon">{getDifficultyStars(cat.difficulty)}</div>
                <h3 className="category-name">{cat.category}</h3>
                <p className="category-difficulty">{getDifficultyLabel(cat.difficulty)}</p>
                <p className="category-info">5 pytań</p>
              </div>
            ))}
          </div>

          {selectedCategory ? (
            <div className="selection-info">
              <p>✓ Prowadzący wybrał: <strong>{selectedCategory}</strong></p>
              <p className="waiting-text">Gra zaraz się rozpocznie...</p>
            </div>
          ) : (
            <div className="waiting-message">
              <div className="spinner"></div>
              <p>Czekaj na decyzję prowadzącego</p>
            </div>
          )}
        </div>
      ) : gamePhase === "buzz" ? (
        // FAZA 2: Pytanie buzz
        <div className="buzz-round-player">
          <div className="buzz-instruction">
            <h2>Kto pierwszy odpowie?</h2>
            <p>Prowadzący odczyta pytanie na głos</p>
            <p className="buzz-hint">Naciśnij przycisk jak najszybciej! ⚡</p>
          </div>

          <button
            className={`buzz-button ${
              isFirst === true ? "buzz-first" : 
              isFirst === false ? "buzz-second" : 
              buzzedTeam ? "buzz-disabled" : ""
            }`}
            onClick={handleBuzz}
            disabled={myTeamBuzzed || buzzedTeam !== null}
          >
            {isFirst === true ? "✓ PIERWSZA! 🎉" : 
             isFirst === false ? "⏱️ ZA PÓŹNO" : 
             buzzedTeam ? "🔒 ZABLOKOWANY" : 
             "NACIŚNIJ!"}
          </button>

          {buzzedTeam && (
            <div className="buzz-result">
              <p>
                {isFirst === true 
                  ? `🎯 Twoja drużyna była pierwsza!` 
                  : `⏰ Drużyna "${buzzedTeam}" była szybsza`}
              </p>
            </div>
          )}
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

            {/* Siatka odpowiedzi - tylko cyfry, odpowiedzi ujawniają się */}
            <div className="answers-grid">
              {currentQuestion?.answers.map((answer, index) => {
                const revealed = gameData?.revealedAnswers?.find(
                  (r) => r.answer === answer.answer
                );
                
                // Pokaż wszystkie odpowiedzi jeśli punkty zostały przekazane
                const showAll = gameData?.pointsTransferred;
                
                return (
                  <div
                    key={index}
                    className={`answer-card ${revealed || showAll ? "revealed" : "hidden"}`}
                  >
                    {revealed || showAll ? (
                      <>
                        <div className="answer-content">
                          <span className="answer-number">{index + 1}.</span>
                          <span className="answer-text">{answer.answer}</span>
                        </div>
                        <span className="answer-points">{revealed ? revealed.points : answer.points}</span>
                      </>
                    ) : (
                      <div className="answer-placeholder">{index + 1}.</div>
                    )}
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

          {/* Informacja o przekazanych punktach */}
          {gameData?.pointsTransferred && gameData?.lastPointsRecipient && (
            <div className="points-transfer-info">
              <div className="transfer-card">
                <h3>🏆 Punkty przekazane!</h3>
                <p><strong>{gameData.lastPointsRecipient}</strong> otrzymuje <strong>{gameData.lastPointsAmount}</strong> punktów</p>
              </div>
            </div>
          )}

          {/* Pasek statusu */}
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
        </div>
      ) : gamePhase === "finished" ? (
        // FAZA 4: Podsumowanie
        <div className="game-summary">
          {(() => {
            const team1Score = gameData?.team1Score || 0;
            const team2Score = gameData?.team2Score || 0;
            const myScore = myTeamNumber === 1 ? team1Score : team2Score;
            const opponentScore = myTeamNumber === 1 ? team2Score : team1Score;
            
            console.log(`[PLAYER SUMMARY] Team 1: ${team1Score}, Team 2: ${team2Score}`);
            console.log(`[PLAYER SUMMARY] My team: ${myTeamNumber}, My score: ${myScore}, Opponent: ${opponentScore}`);
            
            if (team1Score === team2Score) {
              return <h2 className="summary-title">🤝 Remis!</h2>;
            } else if (myScore > opponentScore) {
              return <h2 className="summary-title winner">🎉 Gratulacje! Wygraliście!</h2>;
            } else {
              return <h2 className="summary-title loser">😔 Niestety przegraliście</h2>;
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

          <p style={{ marginTop: "2rem", color: "#666" }}>Czekaj na decyzję prowadzącego...</p>
        </div>
      ) : null}
    </div>
  );
}
