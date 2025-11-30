"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMode } from "@/redux/reducer/gameSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleCreateGame = () => {
    dispatch(setMode('host'));
    router.push('/host');
  };

  const handleJoinGame = () => {
    dispatch(setMode('player'));
    router.push('/join');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">FAMILIADA HALLOWEEN 2.0</h1>
        <p className="home-subtitle">Wybierz tryb gry</p>
        
        <div className="button-container">
          <button 
            className="mode-button host-button"
            onClick={handleCreateGame}
          >
            <div className="button-icon">🎮</div>
            <div className="button-text">
              <h2>Stwórz grę</h2>
              <p>jako prowadzący</p>
            </div>
          </button>

          <button 
            className="mode-button player-button"
            onClick={handleJoinGame}
          >
            <div className="button-icon">👥</div>
            <div className="button-text">
              <h2>Dołącz do gry</h2>
              <p>jako gracz</p>
            </div>
          </button>
        </div>

        <div className="home-footer">
          <p>Wersja 2.0 - Multiplayer Edition</p>
        </div>
      </div>
    </div>
  );
}
