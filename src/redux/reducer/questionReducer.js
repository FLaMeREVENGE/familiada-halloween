import { createSlice } from "@reduxjs/toolkit";
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

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    resetCorrectAnswers: (state) => {
      state.correctAnswers = [];
    },
    resetWrongAnswers: (state) => {
      state.wrongAnswers = [];
    },
    correctAnswer: (state, action) => {
      const answer = action.payload;
      const correctAnswerIndex = state.currentRound.answers.indexOf(answer);

      if (correctAnswerIndex >= 0) {
        const pointsEarned = 100 - 10 * correctAnswerIndex;
        state.correctAnswers.push(answer);
        state.totalPoints += pointsEarned;
      }
    },
    uncorrectAnswer: (state, action) => {
      const incorrectAnswer = action.payload;
      state.wrongAnswers.push(incorrectAnswer);

      if (state.wrongAnswers.length > MAX_WRONG_ANSWERS) {
        state.wrongAnswers.shift();
      }
    },
    transferPoints: (state, action) => {
      const { selectedTeam, pointsToTransfer } = action.payload;
      
      // Zabezpieczenie: tylko team1 i team2 mogą dostać punkty
      if (selectedTeam !== "team1" && selectedTeam !== "team2") return;
      
      state[selectedTeam] += pointsToTransfer;
    },
    nextQuestion: (state) => {
      const currentIndex = state.rounds.indexOf(state.currentRound);
      const nextIndex = currentIndex + 1;

      if (nextIndex < state.rounds.length) {
        state.currentRound = state.rounds[nextIndex];
      }
    },
    selectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
    resetTotalPoints: (state) => {
      state.totalPoints = 0;
    },
    resetGame: () => {
      return {
        ...initialState,
        team3: undefined, // nie przywracaj team3
      };
    },
  },
});

export const {
  resetCorrectAnswers,
  resetWrongAnswers,
  correctAnswer,
  uncorrectAnswer,
  transferPoints,
  nextQuestion,
  selectedTeam,
  resetTotalPoints,
  resetGame,
} = questionSlice.actions;

export default questionSlice.reducer;
