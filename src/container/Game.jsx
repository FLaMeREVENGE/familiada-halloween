import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  correctAnswer,
  nextQuestion,
  resetCorrectAnswers,
  resetGame,
  resetTotalPoints,
  resetWrongAnswers,
  selectedTeam,
  transferPoints,
  uncorrectAnswer,
} from "../redux/actions/questionActions";
import Title from "./Title";
import { handleKeyPress } from "../hooks/keyPressHandlers";
import Modal from "./Modal";
import { useRef } from "react";

export default function Game() {
  const dispatch = useDispatch();
  const team1Score = useSelector((state) => state.question.team1);
  const team2Score = useSelector((state) => state.question.team2);

  const currentRound = useSelector((state) => state.question.currentRound);

  const selectedTeamID = useSelector((state) => state.question.selectedTeam);
  const totalPoints = useSelector((state) => state.question.totalPoints);

  const question = useSelector((state) => state.question.currentRound.question);
  const answers = useSelector((state) => state.question.currentRound.answers);

  const correctAnswers = useSelector((state) => state.question.correctAnswers);
  const wrongAnswers = useSelector((state) => state.question.wrongAnswers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [timer, setTimer] = useState(null);

  const transferPointsButtonRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (correctAnswers.length > 0) {
      handlePlaySoundCorrect();
    }
  }, [correctAnswers]);

  useEffect(() => {
    if (wrongAnswers.length > 0) {
      handlePlaySoundError();
    }
  }, [wrongAnswers]);

  useEffect(() => {
    const keyPressHandler = (event) => {
      if (event.key === "=") {
        handleNextQuestion();
        return;
      }
      if (event.key === "8") {
        setTimer(3);
        return;
      }
      handleKeyPress(event, dispatch, handlers);
    };

    window.addEventListener("keypress", keyPressHandler);

    return () => {
      window.removeEventListener("keypress", keyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (timer === null) return;
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) {
      const timeout = setTimeout(() => {
        setTimer(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [timer]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "5" && transferPointsButtonRef.current) {
        transferPointsButtonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handlePlaySoundError = () => {
    const sound = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2Ffamilida_error.mp3?alt=media&token=fc38a031-2ff9-43f4-8547-0f44ab043a52"
    );
    sound.play();
  };

  const handlePlaySoundCorrect = () => {
    const sound = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2Ffamilida_correct.mp3?alt=media&token=5798c104-e3e6-4b8a-9f7c-8efe88a9839d"
    );
    sound.play();
  };

  const handleSelectTeam = (teamID) => {
    dispatch(selectedTeam(teamID));
  };

  const handleTransferPoints = () => {
    if (selectedTeamID) {
      dispatch(transferPoints(selectedTeamID, totalPoints));
      dispatch(resetTotalPoints());
      setShowAnswers(true);
    }
  };

  const handleInputChange = (event) => {
    if (isModalOpen) {
      return;
    }
  
    const inputValue = event.target.value;
    const sanitizedInputValue = inputValue.replace(/[0-9]/g, "");
    
    setUserAnswer(sanitizedInputValue);
  };
  

  const handleNextQuestion = () => {
    dispatch(resetWrongAnswers());
    dispatch(resetCorrectAnswers());
    dispatch(nextQuestion());
    setShowAnswers(false);
    openModal();
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    setShowAnswers(false);
  };

  const handleResetWrongAnswers = () => {
    dispatch(resetWrongAnswers());
  };

  const isIncorrectAnswer = (answer) => {
    // Uznaj odpowiedź, jeśli wpisane są 3 pierwsze litery poprawnej odpowiedzi (ignorując wielkość liter)
    const normalizedInput = answer.trim().toLowerCase();
    return !answers.some((ans) =>
      ans.trim().toLowerCase().startsWith(normalizedInput)
    );
  };

  const handleAnswer = () => {
    if (userAnswer) {
      const normalizedInput = userAnswer.trim().toLowerCase();
      // znajdź pełną odpowiedź pasującą do 3 pierwszych liter
      const matchedAnswer = answers.find((ans) =>
        ans.trim().toLowerCase().startsWith(normalizedInput)
      );
      if (!matchedAnswer) {
        setUserAnswer("");
        dispatch(uncorrectAnswer(userAnswer));
      } else {
        setUserAnswer("");
        dispatch(correctAnswer(matchedAnswer));
      }
    }
  };

  const handlers = {
    setShowAnswers,
    handleSelectTeam,
    handleNextQuestion,
    setShowAnswers,
    handleTransferPoints,
    handleResetWrongAnswers,
  };

  return (
    <div className="familiada">
      <Title />
      <div className="familiada__question">
        {question}
        <img
          src="https://pngimg.com/d/halloween_PNG21.png"
          className="familiada__players_avatar"
          onClick={openModal}
        />
      </div>
      <div className="familiada__game">
        {wrongAnswers.length > 0 ? null : (
          <div className="familiada__game_error_substytut" />
        )}
        <div className="familiada__game_error">
          {wrongAnswers.slice(0, 4).map((_, index) => (
            <img
              key={index}
              src="https://pngimg.com/d/halloween_PNG10.png"
              alt="Error Symbol"
              className="familiada__game_error_symbol"
            />
          ))}
        </div>
        <div className="familiada__game_table">
          {answers.map((answer, index) => (
            <div key={index} className="familiada__game_table_list">
              <div className="familiada__game_table_answer_number">
                {index + 1}.
              </div>
              {showAnswers || correctAnswers.includes(answer) ? (
                <div className="familiada__game_table_answer_text">
                  {answer}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="familiada__game_error_team">
          {wrongAnswers.length >= 5 && (
            <img
              className="familiada__game_error_team_symbol"
              src="https://static.vecteezy.com/system/resources/previews/009/597/903/original/halloween-pumpkin-scarecrow-png.png"
              alt="Team Error Symbol"
            />
          )}
        </div>
      </div>
      <div className="familiada__game_total">
        <div className="familiada__game_total_points">SUMA: {totalPoints}</div>
        <div
          className="familiada__game_total_send"
          onClick={() => handleTransferPoints()}
          ref={transferPointsButtonRef}
        >
          {"Przekaz punkty: "}
          {selectedTeamID === "team1"
            ? "Rodzina Draculi"
            : selectedTeamID === "team2"
            ? "Rodzina Frankensteina"
            : ""}
        </div>
      </div>
      <div className="familiada__answer">
        <input
          className="familiada__answer_input"
          type="text"
          id="answer"
          name="answer"
          value={userAnswer}
          placeholder="Podaj odpowiedzi..."
          autoComplete="off"
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAnswer();
            }
          }}
        />
        <div className="familiada__answer_button">Odpowiedz</div>
        {timer !== null && timer >= 0 && (
          <div
            style={{
              minWidth: 70,
              minHeight: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #ff0000 60%, #b30000 100%)',
              border: '4px solid #ff4d4d',
              fontSize: 48,
              color: 'white',
              fontFamily: 'Starting Machine',
              boxShadow: '0 0 16px 2px #ff0000',
              fontWeight: 'bold',
            }}
          >
            {timer}
          </div>
        )}
      </div>
      <div className="familiada__players">
        <div className="familiada__players_div">
          <img
            src="https://www.pngarts.com/files/17/Morcego-Halloween-PNG-Pic-HQ.png"
            className="familiada__players_avatar"
          />
          <div
            className={`familiada__players_name ${
              selectedTeamID === "team1"
                ? "familiada__players_name_selected"
                : ""
            }`}
            onClick={() => handleSelectTeam("team1")}
          >
            Rodzina Draculi: {team1Score}
          </div>
        </div>
        <div className="familiada__players_div">
          <img
            src="https://static.vecteezy.com/system/resources/previews/012/658/583/original/halloween-ghost-spooky-ghost-free-png.png"
            className="familiada__players_avatar"
          />
          <div
            className={`familiada__players_name ${
              selectedTeamID === "team2"
                ? "familiada__players_name_selected"
                : ""
            }`}
            onClick={() => handleSelectTeam("team2")}
          >
            Rodzina Frankensteina: {team2Score}
          </div>
        </div>
      </div>
      <div className="familiada__actions">
        <div
          className="familiada__game_total_send"
          onClick={() => handleResetWrongAnswers()}
        >
          Reset zlych odpowiedzi
        </div>
        <div className="familiada__game_total_send" onClick={handleResetGame}>
          Reset
        </div>
        <div
          className="familiada__game_total_send"
          onClick={handleNextQuestion}
        >
          Nastepne pytanie
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
