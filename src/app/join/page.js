"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { joinGame as joinGameAction } from "@/redux/reducer/gameSlice";
import { joinGame, subscribeToGame } from "@/utils/firebaseUtils";

export default function JoinPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [gameCode, setGameCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    if (gameId) {
      const unsubscribe = subscribeToGame(gameId, (gameData) => {
        // Jeśli gra się rozpoczęła, przekieruj do widoku gracza
        if (gameData.status === 'playing') {
          router.push('/game/player');
        }
      });

      return () => unsubscribe();
    }
  }, [gameId]);

  const handleJoinGame = async (e) => {
    e.preventDefault();
    
    if (!gameCode.trim() || !teamName.trim()) {
      setError("Wypełnij wszystkie pola!");
      return;
    }
    
    setIsJoining(true);
    setError(null);
    
    try {
      const result = await joinGame(
        gameCode.toUpperCase().trim(), 
        teamName.trim()
      );
      
      dispatch(joinGameAction({
        gameCode: result.gameCode,
        gameId: result.gameId,
        userId: result.teamId,
        userName: teamName.trim(),
        userTeam: null,
      }));
      
      setGameId(result.gameId);
      
    } catch (err) {
      console.error("Error joining game:", err);
      setError(err.message || "Nie udało się dołączyć do gry.");
      setIsJoining(false);
    }
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (isJoining && gameId) {
    return (
      <div className="join-container">
        <div className="join-content">
          <h1>Oczekiwanie na rozpoczęcie gry...</h1>
          <p>Prowadzący wkrótce rozpocznie rozgrywkę</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-container">
      <div className="join-content">
        <h1 className="join-title">DOŁĄCZ JAKO DRUŻYNA</h1>
        
        <form onSubmit={handleJoinGame} className="join-form">
          <div className="form-group">
            <label htmlFor="gameCode">Kod gry</label>
            <input
              id="gameCode"
              type="text"
              className="form-input code-input"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="np. A7K2"
              maxLength={4}
              disabled={isJoining}
            />
          </div>

          <div className="form-group">
            <label htmlFor="teamName">Nazwa drużyny</label>
            <input
              id="teamName"
              type="text"
              className="form-input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="np. Czerwone Smoki"
              maxLength={30}
              disabled={isJoining}
            />
            <small style={{color: '#888', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block'}}>
              💡 Potrzebne są minimum 2 drużyny do rozpoczęcia gry
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-join"
              disabled={isJoining}
            >
              {isJoining ? 'Dołączanie...' : 'Dołącz'}
            </button>
            <button 
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isJoining}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
