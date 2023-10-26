import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  correctAnswer,
  nextQuestion,
  resetQuestions,
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
  const rounds = useSelector((state) => state.question.rounds);
  const selectedTeamID = useSelector((state) => state.question.selectedTeam);
  const totalPoints = useSelector((state) => state.question.totalPoints);
  const wrongAnswers = useSelector(
    (state) =>
      state.question.rounds[state.question.currentRoundIndex].wrongAnswers
  );
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const handlers = {
      handleSelectTeam,
      handleNextQuestion,
      setShowAnswers,
      handleTransferPoints,
    };

    const keyPressHandler = (event) => {
      handleKeyPress(event, handlers);
    };

    window.addEventListener("keypress", keyPressHandler);

    return () => {
      window.removeEventListener("keypress", keyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(rounds) && rounds.length > 0) {
      setCurrentRound(rounds[currentRoundIndex]);
    }
  }, [rounds, currentRoundIndex]);

  useEffect(() => {
    const storedTeamID = localStorage.getItem("selectedTeamID");
    if (storedTeamID) {
      handleSelectTeam(storedTeamID);
    }
  }, []);
  

  const handleSelectTeam = (teamID) => {
    dispatch(selectedTeam(teamID));
    localStorage.setItem("selectedTeamID", teamID);
  };

  const handlePlaySoundError = () => {
    const sound = new Audio("https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2FX2Download.app%20-%20Z%C5%82a%20odpowiedz%CC%81%20(128%20kbps).mp3?alt=media&token=56940a9b-6ae7-4160-9571-46733ebbf50e");
    sound.play();
  };

  const handlePlaySoundCorrect = () => {
    const sound = new Audio("https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2FX2Download.app%20-%20Familiada%20poprawna%20odpowiedz%CC%81%20(128%20kbps).mp3?alt=media&token=f2b724ff-acc2-4604-9cfe-a60f1ad0ccbb");
    sound.play();
  };

  const handleResetGame = () => {
    dispatch(resetQuestions());
    setCurrentRoundIndex(0);
    setUserAnswer("");
    setErrorCount(0);
    setAnswerSubmitted(false);
    setUserAnswers([]);
  };

  const handleNextQuestion = () => {
    const nextRoundIndex = currentRoundIndex + 1;
    if (nextRoundIndex < rounds.length) {
      setCurrentRoundIndex(nextRoundIndex);
    } else {
      setCurrentRoundIndex(0);
    }

    setUserAnswer("");
    setErrorCount(0);
    setAnswerSubmitted(false);
    dispatch(nextQuestion());
    setShowAnswers(false);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
  
    const formattedInputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
  
    if (!/\d/.test(formattedInputValue)) {
      setUserAnswer(formattedInputValue);
    }
  };
  
  const handleShowAnswer = () => {
    const lowercaseAnswers = currentRound.answers.map((answer) =>
      answer.toLowerCase()
    );

    const userAnswerLowercase = userAnswer.toLowerCase();

    const answerIndex = lowercaseAnswers.findIndex(
      (answer) => answer === userAnswerLowercase || answer.replace(/-/g, '') === userAnswerLowercase
    );

    if (answerIndex !== -1) {
      handlePlaySoundCorrect();
      setUserAnswer("");
      dispatch(correctAnswer(userAnswer));
      setUserAnswers([...userAnswers, userAnswer]);
    } else {
      if (errorCount < 5) {
        setErrorCount(errorCount + 1);
        setUserAnswer("");
        dispatch(uncorrectAnswer(userAnswer));
        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    }
  };

  const handleTransferPoints = () => {
    dispatch(transferPoints(selectedTeamID, totalPoints));
    dispatch(resetTotalPoints());
    setShowAnswers(true)
  };

  return (
    <div className="familiada">
      <Title />
      <div className="familiada__question">{currentRound.question}</div>
      <div className="familiada__game">
        <div className="familiada__game_error">
          <div className="familiada__game_error">
            {Array.from({ length: Math.min(errorCount, 4) }, (_, index) => (
              <div>
                <img
                  key={index}
                  src="https://pngimg.com/d/halloween_PNG10.png"
                  className="familiada__game_error_symbol"
                  alt="Error Symbol"
                  onLoad={handlePlaySoundError}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="familiada__game_table">
          {currentRound && currentRound.answers
            ? currentRound.answers.map((answer, index) => (
                <div className="familiada__game_table_list" key={index}>
                  <div className="familiada__game_table_answer_number">
                    {index + 1}.
                  </div>
                  {showAnswers || userAnswers.includes(answer) ? (
                    <div
                      className={`familiada__game_table_answer_text correct-answer`}
                    >
                      {answer}
                    </div>
                  ) : null}
                </div>
              ))
            : null}
        </div>
        <div
          className={`familiada__game_error_team ${
            wrongAnswers.length >= 5 ? "" : "hidden"
          }`}
        >
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
          onChange={handleInputChange}
          placeholder="Podaj odpowiedzi..."
          autoComplete="off"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleShowAnswer();
            }
          }}
        />
        <div
          className="familiada__answer_button"
          onClick={handleShowAnswer}
          disabled={answerSubmitted}
        >
          Odpowiedz
        </div>
      </div>
      <div className="familiada__answers"></div>
      <div className="familiada__players">
        <div
          className={`familiada__players_name ${
            selectedTeamID === "team1" ? "familiada__players_name_selected" : ""
          }`}
          onClick={() => handleSelectTeam("team1")}
        >
          Agata i Karol: {team1Score}
        </div>
        <div
          className={`familiada__players_name ${
            selectedTeamID === "team2" ? "familiada__players_name_selected" : ""
          }`}
          onClick={() => handleSelectTeam("team2")}
        >
          Klaudia i Darek: {team2Score}
        </div>
        <div
          className={`familiada__players_name ${
            selectedTeamID === "team3" ? "familiada__players_name_selected" : ""
          }`}
          onClick={() => handleSelectTeam("team3")}
        >
          Monika i Dawid: {team3Score}
        </div>
      </div>
      <div className="familiada__actions">
        <div className="familiada__actions_next" onClick={handleResetGame}>
          Reset
        </div>
        <div className="familiada__actions_next" onClick={handleNextQuestion}>
          Następne pytanie
        </div>
      </div>
    </div>
  );
}
