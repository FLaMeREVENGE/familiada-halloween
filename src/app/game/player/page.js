"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getAvailableCategories } from "@/utils/questions";
import { subscribeToGame, buzzIn } from "@/utils/firebaseUtils";
import "@/css/game.css";

export default function PlayerGamePage() {
  const router = useRouter();
  const { gameCode, userName, userId } = useSelector((state) => state.game);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [buzzedTeam, setBuzzedTeam] = useState(null);
  const [myTeamBuzzed, setMyTeamBuzzed] = useState(false);
  const [isFirst, setIsFirst] = useState(null); // true = first, false = second, null = not buzzed
  const [gamePhase, setGamePhase] = useState("category-selection"); // "category-selection" | "buzz-round"

  useEffect(() => {
    if (!gameCode) {
      router.push("/home");
      return;
    }

    // Załaduj dostępne kategorie
    const availableCategories = getAvailableCategories();
    setCategories(availableCategories);

    // Nasłuchuj na wybór kategorii przez hosta
    const unsubscribe = subscribeToGame(gameCode, (gameData) => {
      if (gameData.selectedCategory && !selectedCategory) {
        setSelectedCategory(gameData.selectedCategory);
        setGamePhase("buzz-round");
        console.log(`[PLAYER] Host selected category: ${gameData.selectedCategory}`);
      }

      // Aktualizuj stan przycisku buzz
      if (gameData.buzzedTeamName) {
        setBuzzedTeam(gameData.buzzedTeamName);
        
        // Sprawdź czy to moja drużyna wcisnęła
        if (gameData.buzzedTeam === userId) {
          setMyTeamBuzzed(true);
          setIsFirst(true);
        } else if (myTeamBuzzed && gameData.buzzedTeam !== userId) {
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
  }, [gameCode, router, selectedCategory, userId, myTeamBuzzed]);

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
      <div className="game-header">
        <h1>🎮 {gamePhase === "category-selection" ? "Oczekiwanie na wybór zestawu" : "Pytanie 1"}</h1>
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
      ) : (
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
      )}
    </div>
  );
}
