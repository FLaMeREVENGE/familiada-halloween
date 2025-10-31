import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Modal = ({ isOpen, onClose }) => {
  const [pressedKeys, setPressedKeys] = useState([]);
  const [isAvatarActive1, setIsAvatarActive1] = useState(false);
  const [isAvatarActive2, setIsAvatarActive2] = useState(false);
  const answersCount = useSelector((state) => state.question.currentRound.answers.length);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "a") {
      setIsAvatarActive1(!isAvatarActive1);
      setPressedKeys((prevKeys) => [...prevKeys, "a"]);
    } else if (e.key === "'") {
      setIsAvatarActive2(!isAvatarActive2);
      setPressedKeys((prevKeys) => [...prevKeys, "'"]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setIsAvatarActive1(false);
      setIsAvatarActive2(false);
      setPressedKeys([]);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);



  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ fontSize: 32, color: 'orange', marginBottom: 10, fontFamily: 'Starting Machine' }}>
          Liczba odpowiedzi: {answersCount}
        </div>
        <button className="modal-close" onClick={onClose}>
          <img
            src="https://pngimg.com/d/halloween_PNG21.png"
            className="familiada__players_avatar"
            alt="Close Modal"
          />
        </button>
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
                className={`avatar-number${
                  pressedKeys[0] === "a" ? " avatar-number_first" : ""
                }`}
              ></div>
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
                className={`avatar-number${
                  pressedKeys[0] === "'" ? " avatar-number_first" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
