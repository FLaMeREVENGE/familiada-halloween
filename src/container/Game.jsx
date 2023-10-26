import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  correctAnswer,
  nextQuestion,
  resetGame,
  resetTotalPoints,
  selectedTeam,
  transferPoints,
  uncorrectAnswer,
} from "../redux/actions/questionActions";
import Title from "./Title";
import { useRef } from "react";
import { handleKeyPress } from "../hooks/keyPressHandlers";

export default function Game() {
  const dispatch = useDispatch();
  const team1Score = useSelector((state) => state.question.team1);
  const team2Score = useSelector((state) => state.question.team2);
  const team3Score = useSelector((state) => state.question.team3);

  const selectedTeam = useSelector((state) => state.question.selectedTeam);
  const totalPoints = useSelector((state) => state.question.totalPoints);
  const currentRound = useSelector((state) => state.question.currentRound);

  const question = useSelector((state) => state.question.currentRound.question);
  const answers = useSelector((state) => state.question.currentRound.answers);

  const correctAnswers = useSelector(
    (state) => state.question.currentRound.correctAnswers
  );
  const wrongAnswers = useSelector(
    (state) => state.question.currentRound.wrongAnswers
  );

  const [userAnswer, setUserAnswer] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const audioRef = useRef(null);

  const handlers = {
    setShowAnswers,
  };

  useEffect(() => {
    const keyPressHandler = (event) => {
      handleKeyPress(event, handlers);
    };

    window.addEventListener("keypress", keyPressHandler);

    return () => {
      window.removeEventListener("keypress", keyPressHandler);
    };
  }, []);

  const handlePlaySoundError = () => {
    const sound = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2FX2Download.app%20-%20Z%C5%82a%20odpowiedz%CC%81%20(128%20kbps).mp3?alt=media&token=56940a9b-6ae7-4160-9571-46733ebbf50e"
    );
    sound.play();
  };

  const handlePlaySoundCorrect = () => {
    const sound = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2FX2Download.app%20-%20Familiada%20poprawna%20odpowiedz%CC%81%20(128%20kbps).mp3?alt=media&token=f2b724ff-acc2-4604-9cfe-a60f1ad0ccbb"
    );
    sound.play();
  };

  const handleTransferPoints = () => {
    dispatch(resetTotalPoints());
    setShowAnswers(true);
  };

  const handleInputChange = (event) => {
    const capitalizedAnswer = event.target.value
      .toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase());

    setUserAnswer(capitalizedAnswer);
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
  };

  const handleResetGame = () => {
    dispatch(resetGame());
  };

  const isIncorrectAnswer = (answer) => {
    return !answers.includes(answer);
  };
  
  const handleAnswer = () => {
    if (userAnswer) {
      if (isIncorrectAnswer(userAnswer)) {
        dispatch(uncorrectAnswer(userAnswer));
      } else {
        dispatch(correctAnswer(userAnswer));
      }
      setAnswerSubmitted(true);
    }
  };

  return (
    <div className="familiada">
      <Title />
      <div className="familiada__question">{question}</div>
      <div className="familiada__game">
        <div className="familiada__game_error">
          <div className="familiada__game_error">
            <div>
              <img
                src="https://pngimg.com/d/halloween_PNG10.png"
                className="familiada__game_error_symbol"
                alt="Error Symbol"
                onLoad={handlePlaySoundError}
              />
            </div>
          </div>
        </div>
        <div className="familiada__game_table">
          {answers.map((answer, index) => (
            <div key={index} className="familiada__game_table_list">
              <div className="familiada__game_table_answer_number">
                {index + 1}.
              </div>
              {showAnswers ? (
                <div className="familiada__game_table_answer_text">
                  {answer}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="familiada__game_error_team">
          <img
            className="familiada__game_error_team_symbol"
            src="https://static.vecteezy.com/system/resources/previews/009/597/903/original/halloween-pumpkin-scarecrow-png.png"
            alt="Team Error Symbol"
            onLoad={handlePlaySoundError}
          />
        </div>
      </div>
      <div className="familiada__game_total">
        <div className="familiada__game_total_points">SUMA: {totalPoints}</div>
        <div
          className="familiada__game_total_send"
          onClick={() => handleTransferPoints()}
        >
          Przekaz punkty
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
              handleShowAnswer();
            }
          }}
        />
        <div className="familiada__answer_button" disabled={answerSubmitted} onClick={handleAnswer}>
          Odpowiedz
        </div>
      </div>
      <div className="familiada__answers"></div>
      <div className="familiada__players">
        <div
          className={`familiada__players_name ${
            selectedTeam === "team1" ? "familiada__players_name_selected" : ""
          }`}
          onClick={() => handleSelectTeam("team1")}
        >
          Agata i Karol: {team1Score}
        </div>
        <div
          className={`familiada__players_name ${
            selectedTeam === "team2" ? "familiada__players_name_selected" : ""
          }`}
          onClick={() => handleSelectTeam("team2")}
        >
          Klaudia i Darek: {team2Score}
        </div>
        <div
          className={`familiada__players_name ${
            selectedTeam === "team3" ? "familiada__players_name_selected" : ""
          }`}
          onClick={() => handleSelectTeam("team3")}
        >
          Monika i Dawid: {team3Score}
        </div>
      </div>
      <div className="familiada__actions">
        <div className="familiada__actions_next" onClick={handleResetGame}>Reset</div>
        <div className="familiada__actions_next" onClick={handleNextQuestion}>Następne pytanie</div>
      </div>
    </div>
  );
}
