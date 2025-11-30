export const handleKeyPress = (event, dispatch, handlers) => {
  switch (event.key) {
    case "1":
      handlers.handleSelectTeam("team1");
      break;
    case "2":
      handlers.handleSelectTeam("team2");
      break;
    case "9":
      handlers.handleResetWrongAnswers();
      break;
    case "0":
      handlers.handleNextQuestion();
      break;
    default:
      break;
  }
};
