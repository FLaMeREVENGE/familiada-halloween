export const handleKeyPress = (event, handlers) => {
    switch (event.key) {
      case "1":
        handlers.handleSelectTeam("team1");
        break;
      case "2":
        handlers.handleSelectTeam("team2");
        break;
      case "3":
        handlers.handleSelectTeam("team3");
        break;
      case "0":
        handlers.handleNextQuestion();
        break;
      case "9":
        handlers.setShowAnswers(true);
        break;
      default:
        break;
    }
  };
  