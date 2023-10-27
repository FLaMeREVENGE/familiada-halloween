import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Modal = ({ isOpen, onClose }) => {
  const question = useSelector((state) => state.question.currentRound.question);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [isAvatarActive1, setIsAvatarActive1] = useState(false);
  const [isAvatarActive2, setIsAvatarActive2] = useState(false);
  const [isAvatarActive3, setIsAvatarActive3] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [remainingShowAnswerTime, setRemainingShowAnswerTime] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "a" && !timerStarted) {
      setIsAvatarActive1(!isAvatarActive1);
      setPressedKeys((prevKeys) => [...prevKeys, "a"]);
      startTimer();
      playAvatarSound();
    } else if (e.key === "h" && !timerStarted) {
      setIsAvatarActive2(!isAvatarActive2);
      setPressedKeys((prevKeys) => [...prevKeys, "h"]);
      startTimer();
      playAvatarSound();
    } else if (e.key === "'" && !timerStarted) {
      setIsAvatarActive3(!isAvatarActive3);
      setPressedKeys((prevKeys) => [...prevKeys, "'"]);
      startTimer();
      playAvatarSound();
    } else if (e.key === "6" && !timerStarted) {
      handleShowQuestion();
      setShowQuestion(false);
    }
  };

  const startTimer = () => {
    if (remainingTime === null) {
      setRemainingTime(5);
      setTimerStarted(true);
    }
  };

  const handleShowQuestion = () => {
    setRemainingShowAnswerTime(5);
    setShowQuestion(false);
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setIsAvatarActive1(false);
      setIsAvatarActive2(false);
      setIsAvatarActive3(false);
      setPressedKeys([]);
      setRemainingTime(null);
      setTimerStarted(false);
      setShowQuestion(false);
      setRemainingShowAnswerTime(0);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (remainingTime !== null && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (remainingTime === 0) {
      handlePlaySoundTimeout();
    }

    return () => clearInterval(interval);
  }, [remainingTime]);

  useEffect(() => {
    let countdownInterval;
    if (remainingShowAnswerTime > 0) {
      countdownInterval = setInterval(() => {
        setRemainingShowAnswerTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingShowAnswerTime === 0) {
      setShowQuestion(true);
    }

    return () => clearInterval(countdownInterval);
  }, [remainingShowAnswerTime]);

  const handlePlaySoundTimeout = () => {
    const sound = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2FX2Download.app%20-%20Time%20out%20Buzzer%20Sound%20effect%20(128%20kbps).mp3?alt=media&token=dda52c38-adc7-4632-9734-b858cf9d46be"
    );
    sound.play();
  };

  const playAvatarSound = () => {
    const sound = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/graminator.appspot.com/o/IMG%2FUTILS%2FX2Download.app%20-%20Video%20Game%20Beep%20-%20Sound%20Effect%20(128%20kbps).mp3?alt=media&token=dfcf90e7-6a63-4778-9e72-eec0ab2f291a"
    );
    sound.play();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <img
            src="https://png.pngtree.com/png-clipart/20220916/ourmid/pngtree-mushroom-zombie-cartoon-png-image_6176780.png"
            className="familiada__players_avatar"
            alt="Close Modal"
          />
        </button>
        {!showQuestion && remainingShowAnswerTime <= 0 && (
          <button
            className="modal_question"
            onClick={() => {
              handleShowQuestion();
              setShowQuestion(false);
            }}
          >
            Pokaz Pytanie
          </button>
        )}
        {showQuestion ? (
          <div className="modal_question">{question}</div>
        ) : remainingShowAnswerTime > 0 ? (
          <div className="modal_question">{remainingShowAnswerTime}</div>
        ) : null}
        {remainingTime !== null && (
          <div className="modal_timer">{remainingTime}</div>
        )}
        <div className="modal-content">
          <div className="avatars">
            <div className="avatar">
              <img
                src="https://www.pngarts.com/files/17/Morcego-Halloween-PNG-Pic-HQ.png"
                className={`modal_avatar ${
                  isAvatarActive1 && "modal_avatar_active"
                }`}
                alt="Avatar 1"
              />
              <div
                className={`avatar-number ${
                  pressedKeys.includes("a") && pressedKeys.indexOf("a") === 0
                    ? "avatar-number_first"
                    : ""
                }`}
              >
                {pressedKeys.includes("a") ? pressedKeys.indexOf("a") + 1 : ""}
              </div>
            </div>
            <div className="avatar">
              <img
                src="https://static.vecteezy.com/system/resources/previews/012/658/583/original/halloween-ghost-spooky-ghost-free-png.png"
                className={`modal_avatar ${
                  isAvatarActive2 && "modal_avatar_active"
                }`}
                alt="Avatar 2"
              />
              <div
                className={`avatar-number ${
                  pressedKeys.includes("h") && pressedKeys.indexOf("h") === 0
                    ? "avatar-number_first"
                    : ""
                }`}
              >
                {pressedKeys.includes("h") ? pressedKeys.indexOf("h") + 1 : ""}
              </div>
            </div>
            <div className="avatar">
              <img
                src="https://pngimg.com/d/halloween_PNG36.png"
                className={`modal_avatar ${
                  isAvatarActive3 && "modal_avatar_active"
                }`}
                alt="Avatar 3"
              />
              <div
                className={`avatar-number ${
                  pressedKeys.includes("'") && pressedKeys.indexOf("'") === 0
                    ? "avatar-number_first"
                    : ""
                }`}
              >
                {pressedKeys.includes("'") ? pressedKeys.indexOf("'") + 1 : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
