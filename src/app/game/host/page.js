"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getAvailableCategories, getQuestionsByCategory } from "@/utils/questions";
import { selectCategory, subscribeToGame, resetBuzz } from "@/utils/firebaseUtils";
import "@/css/game.css";

export default function HostGamePage() {
  const router = useRouter();
  const { gameCode, teams } = useSelector((state) => state.game);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [buzzedTeam, setBuzzedTeam] = useState(null);
  const [gamePhase, setGamePhase] = useState("category-selection"); // "category-selection" | "buzz-round"

  useEffect(() => {
    if (!gameCode) {
      router.push("/home");
      return;
    }

    // Załaduj dostępne kategorie
    const availableCategories = getAvailableCategories();
    setCategories(availableCategories);

    // Nasłuchuj zmian w grze
    const unsubscribe = subscribeToGame(gameCode, (gameData) => {
      if (gameData.selectedCategory && !selectedCategory) {
        setSelectedCategory(gameData.selectedCategory);
        
        // Załaduj pytania dla wybranej kategorii
        const categoryQuestions = getQuestionsByCategory(gameData.selectedCategory);
        setQuestions(categoryQuestions);
        
        if (categoryQuestions.length > 0) {
          setCurrentQuestion(categoryQuestions[0]);
          setGamePhase("buzz-round");
        }
      }

      // Aktualizuj stan przycisku buzz
      if (gameData.buzzedTeamName) {
        setBuzzedTeam(gameData.buzzedTeamName);
      } else {
        setBuzzedTeam(null);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [gameCode, router, selectedCategory]);

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
      <div className="game-header">
        <h1>🎮 {gamePhase === "category-selection" ? "Wybierz zestaw pytań" : "Pytanie 1"}</h1>
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
      ) : (
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

          <button 
            className="btn-reset"
            onClick={handleResetBuzz}
          >
            🔄 Reset przycisku
          </button>
        </div>
      )}
    </div>
  );
}
