import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Tryb gry
  mode: null, // null | 'host' | 'player'
  
  // Informacje o grze
  gameCode: null,
  gameId: null,
  status: 'idle', // 'idle' | 'waiting' | 'playing' | 'finished'
  
  // Informacje o użytkowniku
  userId: null,
  userName: null,
  userTeam: null, // 'team1' | 'team2'
  
  // Lista drużyn [{id, name, joinedAt}]
  teams: [],
  
  // Stan połączenia
  isConnected: false,
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // Ustawienie trybu (host/player)
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    
    // Tworzenie gry (host)
    createGame: (state, action) => {
      const { gameCode, gameId, userId } = action.payload;
      state.gameCode = gameCode;
      state.gameId = gameId;
      state.userId = userId;
      state.mode = 'host';
      state.status = 'waiting';
      state.isConnected = true;
    },
    
    // Dołączanie do gry (player)
    joinGame: (state, action) => {
      const { gameCode, gameId, userId, userName, userTeam } = action.payload;
      state.gameCode = gameCode;
      state.gameId = gameId;
      state.userId = userId;
      state.userName = userName;
      state.userTeam = userTeam;
      state.mode = 'player';
      state.isConnected = true;
    },
    
    // Aktualizacja statusu gry
    updateGameStatus: (state, action) => {
      state.status = action.payload;
    },
    
    // Aktualizacja listy graczy
    updateTeams: (state, action) => {
      state.teams = action.payload;
    },
    
    // Ustawienie błędu
    setError: (state, action) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    
    // Reset gry (wyjście)
    leaveGame: () => {
      return initialState;
    },
    
    // Aktualizacja połączenia
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setMode,
  createGame,
  joinGame,
  updateGameStatus,
  updateTeams,
  setError,
  leaveGame,
  setConnected,
} = gameSlice.actions;

export default gameSlice.reducer;
