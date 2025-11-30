import questions from "@/utils/questions";

const initialState = {
  team1: 0,
  team2: 0,
  rounds: questions,
  selectedTeam: null,
  totalPoints: 0,
  currentRound: questions[0],
  correctAnswers: [],
  wrongAnswers: [],
};

const MAX_WRONG_ANSWERS = 5;

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RESET_CORRECT_ANSWERS":
      return {
        ...state,
        correctAnswers: [],
      };
    case "RESET_WRONG_ANSWERS":
      return {
        ...state,
        wrongAnswers: [],
      };
    case "CORRECT_ANSWER":
      const { payload: answer } = action;
      const currentRound = state.currentRound;
      const correctAnswerIndex = currentRound.answers.indexOf(answer);

      if (correctAnswerIndex >= 0) {
        const pointsEarned = 100 - 10 * correctAnswerIndex;

        return {
          ...state,
          correctAnswers: [...state.correctAnswers, answer],
          totalPoints: state.totalPoints + pointsEarned,
        };
      }
      return state;
    case "UNCORRECT_ANSWER":
      const { payload: incorrectAnswer } = action;
      const updatedWrongAnswers = [...state.wrongAnswers, incorrectAnswer];

      if (updatedWrongAnswers.length > MAX_WRONG_ANSWERS) {
        updatedWrongAnswers.shift();
      }

      return {
        ...state,
        wrongAnswers: updatedWrongAnswers,
      };

    case "TRANSFER_POINTS":
      const { selectedTeam, pointsToTransfer } = action.payload;
      const currentTeamScore = state[selectedTeam];
      // Zabezpieczenie: tylko team1 i team2 mogą dostać punkty
      if (selectedTeam !== "team1" && selectedTeam !== "team2") return state;
      return {
        ...state,
        [selectedTeam]: currentTeamScore + pointsToTransfer,
      };
    case "NEXT_QUESTION":
      const currentIndex = state.rounds.indexOf(state.currentRound);
      const nextIndex = currentIndex + 1;

      if (nextIndex < state.rounds.length) {
        return {
          ...state,
          currentRound: state.rounds[nextIndex],
        };
      } else {
        return state;
      }

    case "SELECTED_TEAM":
      const { payload: teamID } = action;
      return {
        ...state,
        selectedTeam: teamID,
      };
    case "RESET_TOTAL_POINTS":
      return {
        ...state,
        totalPoints: 0,
      };
    case "RESET_GAME":
      return {
        ...initialState,
        team3: undefined // nie przywracaj team3
      };
    default:
      return state;
  }
};

export default questionReducer;
