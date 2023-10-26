import questions from "@/utils/questions";

const initialState = {
  team1: 0,
  team2: 0,
  team3: 0,
  rounds: questions,
  selectedTeam: null,
  totalPoints: 0,
  currentRound: questions[0],
};

const MAX_WRONG_ANSWERS = 5;

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UNCORRECT_ANSWER":
      let updatedCurrentRound = state.currentRound;
      if (state.selectedTeam) {
        updatedCurrentRound =
          state.rounds.find((round) => round.team === state.selectedTeam) ||
          state.currentRound;
      }
      updatedCurrentRound = {
        ...updatedCurrentRound,
        wrongAnswers: [...updatedCurrentRound.wrongAnswers, action.payload],
      };
      return {
        ...state,
        currentRound: updatedCurrentRound,
      };

    case "CORRECT_ANSWER":
      let updatedCurrentRoundCorrect = state.currentRound;
      if (state.selectedTeam) {
        updatedCurrentRoundCorrect =
          state.rounds.find((round) => round.team === state.selectedTeam) ||
          state.currentRound;
      }
      updatedCurrentRoundCorrect = {
        ...updatedCurrentRoundCorrect,
        correctAnswers: [
          ...updatedCurrentRoundCorrect.correctAnswers,
          action.payload,
        ],
      };
      return {
        ...state,
        currentRound: updatedCurrentRoundCorrect,
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
    case "RESET_GAME":
      return initialState;
    default:
      return state;
  }
};

export default questionReducer;
