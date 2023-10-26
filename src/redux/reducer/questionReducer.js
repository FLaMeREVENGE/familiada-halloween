import questions from "@/utils/questions";

const initialState = {
  team1: 0,
  team2: 0,
  team3: 0,
  rounds: questions,
  currentRound: questions[0],
  selectedTeam: null,
  totalPoints: 0,
  // currentRound: questions[0],
};

const MAX_WRONG_ANSWERS = 5;

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECTED_TEAM":
      return {
        ...state,
        selectedTeam: action.payload,
      };
    case "TRANSFER_POINTS":
      const { selectedTeam, pointsToTransfer } = action.payload;
      const selectedTeamPoints = state[selectedTeam];
      const updatedTeamPoints = selectedTeamPoints + pointsToTransfer;
      return {
        ...state,
        [selectedTeam]: updatedTeamPoints,
      };
    case "RESET_TOTAL_POINTS":
      return {
        ...state,
        totalPoints: 0,
      };
    case "COUNT_POINTS":
      const currentRoundIndexCountPoints = state.currentRoundIndex;
      const currentRoundCountPoints =
        state.rounds[currentRoundIndexCountPoints];

      if (currentRoundCountPoints) {
        const firstAnswer = currentRoundCountPoints.answers[0];

        const correctAnswerGiven =
          currentRoundCountPoints.teamAnswers.length > 0 &&
          currentRoundCountPoints.teamAnswers[0].toLowerCase() ===
            firstAnswer.toLowerCase();

        if (correctAnswerGiven) {
          const pointsToAdd = action.points;
          const updatedTotalPoints = state.totalPoints + pointsToAdd;

          return {
            ...state,
            totalPoints: updatedTotalPoints,
          };
        }
      }
      return state;
    case "CORRECT_ANSWER":
      const currentRoundIndexCorrect = state.currentRoundIndex;
      const currentRoundCorrect = state.rounds[currentRoundIndexCorrect];

      if (currentRoundCorrect) {
        const lowercaseAnswers = currentRoundCorrect.answers.map((answer) =>
          answer.toLowerCase()
        );

        if (lowercaseAnswers.includes(action.payload.toLowerCase())) {
          const updatedAnswers = [...currentRoundCorrect.teamAnswers];
          const answerToAdd = action.payload.toLowerCase();

          if (!updatedAnswers.includes(answerToAdd)) {
            updatedAnswers.push(answerToAdd);

            const answerIndex = lowercaseAnswers.indexOf(answerToAdd);
            const pointsToAdd = 100 - answerIndex * 10;

            const updatedRoundsCorrect = [...state.rounds];
            updatedRoundsCorrect[currentRoundIndexCorrect] = {
              ...currentRoundCorrect,
              teamAnswers: updatedAnswers,
            };

            const updatedTotalPoints = state.totalPoints + pointsToAdd;

            return {
              ...state,
              rounds: updatedRoundsCorrect,
              totalPoints: updatedTotalPoints,
            };
          }
        }
      }
      return state;
    case "UNCORRECT_ANSWER":
      const currentRoundIndexUncorrect = state.currentRoundIndex;
      const currentRoundUncorrect = state.rounds[currentRoundIndexUncorrect];

      if (currentRoundUncorrect) {
        const lowercaseAnswers = currentRoundUncorrect.answers.map((answer) =>
          answer.toLowerCase()
        );

        if (lowercaseAnswers.includes(action.payload.toLowerCase())) {
          return {
            ...state,
          };
        }

        let updatedWrongAnswers = [
          ...currentRoundUncorrect.wrongAnswers,
          action.payload,
        ];

        if (updatedWrongAnswers.length > MAX_WRONG_ANSWERS) {
          updatedWrongAnswers = updatedWrongAnswers.slice(0, MAX_WRONG_ANSWERS);
        }

        const updatedRoundsUncorrect = [...state.rounds];
        updatedRoundsUncorrect[currentRoundIndexUncorrect] = {
          ...currentRoundUncorrect,
          wrongAnswers: updatedWrongAnswers,
        };

        return {
          ...state,
          rounds: updatedRoundsUncorrect,
        };
      }
      return state;
    case "RESET_QUESTIONS":
      return initialState;
    case "NEXT_QUESTION":
      const nextRoundIndex = state.currentRoundIndex + 1;
      if (nextRoundIndex < state.rounds.length) {
        return {
          ...state,
          currentRoundIndex: nextRoundIndex,
        };
      } else {
        return {
          ...state,
          currentRoundIndex: 0,
        };
      }
    default:
      return state;
  }
};

export default questionReducer;
