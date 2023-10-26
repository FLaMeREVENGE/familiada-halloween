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
    case "RESET_WRONG_ANSWERS":
  let updatedCurrentRoundReset = state.currentRound;
  if (state.selectedTeam) {
    updatedCurrentRoundReset =
      state.rounds.find((round) => round.team === state.selectedTeam) ||
      state.currentRound;
  }
  updatedCurrentRoundReset = {
    ...updatedCurrentRoundReset,
    wrongAnswers: [],
  };
  return {
    ...state,
    currentRound: updatedCurrentRoundReset,
  };
    case "TRANSFER_POINTS":
      const { selectedTeam, pointsToTransfer } = action.payload;
      const currentTeamScore = state[selectedTeam];
      return {
        ...state,
        [selectedTeam]: currentTeamScore + pointsToTransfer,
      };
    case "UNCORRECT_ANSWER":
      let updatedCurrentRoundUncorrect = state.currentRound;
      if (state.selectedTeam) {
        updatedCurrentRoundUncorrect =
          state.rounds.find((round) => round.team === state.selectedTeam) ||
          state.currentRound;
      }

      if (
        updatedCurrentRoundUncorrect.wrongAnswers.length >= MAX_WRONG_ANSWERS
      ) {
        return state;
      }

      updatedCurrentRoundUncorrect = {
        ...updatedCurrentRoundUncorrect,
        wrongAnswers: [
          ...updatedCurrentRoundUncorrect.wrongAnswers,
          action.payload,
        ],
      };

      return {
        ...state,
        currentRound: updatedCurrentRoundUncorrect,
      };
    case "CORRECT_ANSWER":
      const { payload: answer } = action;
      let updatedCurrentRoundCorrect = state.currentRound;
      if (state.selectedTeam) {
        updatedCurrentRoundCorrect =
          state.rounds.find((round) => round.team === state.selectedTeam) ||
          state.currentRound;
      }

      const correctAnswerIndex =
        updatedCurrentRoundCorrect.answers.indexOf(answer);

      let pointsToAdd = 0;
      if (correctAnswerIndex !== -1) {
        pointsToAdd = 100 - 10 * correctAnswerIndex;
      }

      updatedCurrentRoundCorrect = {
        ...updatedCurrentRoundCorrect,
        correctAnswers: [...updatedCurrentRoundCorrect.correctAnswers, answer],
      };

      return {
        ...state,
        currentRound: updatedCurrentRoundCorrect,
        totalPoints: state.totalPoints + pointsToAdd,
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
      return initialState;
    default:
      return state;
  }
};

export default questionReducer;
