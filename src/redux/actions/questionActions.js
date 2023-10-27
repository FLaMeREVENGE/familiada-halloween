export const nextQuestion = () => {
  return {
    type: "NEXT_QUESTION",
  };
};

export const transferPoints = (selectedTeam, pointsToTransfer) => {
  return {
    type: "TRANSFER_POINTS",
    payload: { selectedTeam, pointsToTransfer },
  };
};

export const resetWrongAnswers = () => ({
  type: "RESET_WRONG_ANSWERS",
});

export const resetCorrectAnswers = () => ({
  type: "RESET_CORRECT_ANSWERS",
});

export const resetTotalPoints = () => {
  return {
    type: "RESET_TOTAL_POINTS",
  };
};

export const correctAnswer = (answer) => ({
  type: "CORRECT_ANSWER",
  payload: answer,
});

export const uncorrectAnswer = (incorrectAnswer) => {
  return {
    type: "UNCORRECT_ANSWER",
    payload: incorrectAnswer,
  };
};

export const selectedTeam = (teamID) => ({
  type: "SELECTED_TEAM",
  payload: teamID,
});

export const resetGame = () => {
  return {
    type: "RESET_GAME",
  };
};
