import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  correctAnswer,
  nextQuestion,
  resetGame,
  resetTotalPoints,
  resetWrongAnswers,
  selectedTeam,
  transferPoints,
  uncorrectAnswer,
} from "../redux/actions/questionActions";
import Title from "./Title";
import { handleKeyPress } from "../hooks/keyPressHandlers";

export default function Game() {
  const dispatch = useDispatch();
  const team1Score = useSelector((state) => state.question.team1);
  const team2Score = useSelector((state) => state.question.team2);
  const team3Score = useSelector((state) => state.question.team3);

  const selectedTeamID = useSelector((state) => state.question.selectedTeam);
  const totalPoints = useSelector((state) => state.question.totalPoints);

  const question = useSelector((state) => state.question.currentRound.question);
  const answers = useSelector((state) => state.question.currentRound.answers);

  const correctAnswers = useSelector(
    (state) => state.question.currentRound.correctAnswers
  );
  const wrongAnswers = useSelector(
    (state) => state.question.currentRound.wrongAnswers
  );

  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

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
      handleKeyPress(event, dispatch, handlers);
    };

    window.addEventListener("keypress", keyPressHandler);

    return () => {
      window.removeEventListener("keypress", keyPressHandler);
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
    const inputValue = event.target.value;
    const sanitizedInputValue = inputValue.replace(/[0-9]/g, "");
    const words = sanitizedInputValue.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    const capitalizedAnswer = capitalizedWords.join(" ");
    setUserAnswer(capitalizedAnswer);
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
    dispatch(nextQuestion());
    setShowAnswers(false);
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    setShowAnswers(false);
  };

  const handleResetWrongAnswers = () => {
    dispatch(resetWrongAnswers());
  };

  const isIncorrectAnswer = (answer) => {
    return !answers.includes(answer);
  };

  const handleAnswer = () => {
    if (userAnswer) {
      if (isIncorrectAnswer(userAnswer)) {
        setUserAnswer("");
        dispatch(uncorrectAnswer(userAnswer));
      } else {
        setUserAnswer("");
        dispatch(correctAnswer(userAnswer));
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
      <div className="familiada__question">{question}</div>
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
              onLoad={handlePlaySoundError}
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
              onLoad={handlePlaySoundError}
            />
          )}
        </div>
      </div>
      <div className="familiada__game_total">
        <div className="familiada__game_total_points">SUMA: {totalPoints}</div>

        <div
          className="familiada__game_total_send"
          onClick={() => handleTransferPoints()}
        >
          Przekaz punkty {selectedTeamID}
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
            Agata i Karol: {team1Score}
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
            Klaudia i Darek: {team2Score}
          </div>
        </div>
        <div className="familiada__players_div">
          <img
            src="https://assets.stickpng.com/images/5f468cb297b4fe000462da2c.png"
            className="familiada__players_avatar"
          />
          <div
            className={`familiada__players_name ${
              selectedTeamID === "team3"
                ? "familiada__players_name_selected"
                : ""
            }`}
            onClick={() => handleSelectTeam("team3")}
          >
            Monika i Dawid: {team3Score}
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
    </div>
  );
}
