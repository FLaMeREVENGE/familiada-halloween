import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import questions from './questions';
import { localGameStorage } from './localGameStorage';

// Sprawdź czy Firebase jest dostępny (true = Firebase, false = demo mode)
const useFirebase = db && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project';

if (!useFirebase) {
  console.warn('🔶 DEMO MODE: Firebase nie jest skonfigurowany. Używam lokalnego storage.');
  console.log('📝 Aby skonfigurować Firebase, przejdź do FIREBASE_SETUP.md');
}

// Generowanie unikalnego 4-cyfrowego kodu
export const generateGameCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generowanie unikalnego ID użytkownika
export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Tworzenie nowej gry
export const createGame = async (hostId) => {
  try {
    const gameCode = generateGameCode();
    console.log(`[CREATE] Creating game with code: ${gameCode}`);
    
    const gameData = {
      code: gameCode,
      hostId: hostId,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      
      // Stan gry
      team1Score: 0,
      team2Score: 0,
      currentQuestionIndex: 0,
      currentRound: questions[0],
      totalPoints: 0,
      correctAnswers: [],
      wrongAnswers: [],
      selectedTeam: null,
      
      // Gracze
      players: [],
      rounds: questions,
    };

    if (useFirebase) {
      console.log(`[CREATE] Saving to Firestore...`);
      const gameRef = doc(db, 'games', gameCode);
      await setDoc(gameRef, gameData);
      console.log(`[CREATE] Game ${gameCode} created in Firestore successfully!`);
    } else {
      // Demo mode - użyj lokalnego storage
      await localGameStorage.createGame(gameCode, gameData);
      console.log(`[CREATE] Game ${gameCode} created in local storage`);
    }
    
    return { gameCode, gameId: gameCode };
  } catch (error) {
    console.error('[CREATE] Error creating game:', error);
    console.error('[CREATE] Error details:', error.message);
    throw error;
  }
};

// Dołączanie do gry jako drużyna
export const joinGame = async (gameCode, teamName) => {
  try {
    // Wyczyść i normalizuj kod gry
    const cleanGameCode = gameCode.toUpperCase().trim();
    console.log(`[JOIN] Attempting to join game: ${cleanGameCode} as team "${teamName}"`);
    
    let gameData;
    
    if (useFirebase) {
      const gameRef = doc(db, 'games', cleanGameCode);
      console.log(`[JOIN] Checking Firestore for game: ${cleanGameCode}`);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        console.error(`[JOIN] Game ${cleanGameCode} not found in Firestore`);
        throw new Error('Gra nie istnieje');
      }
      
      gameData = gameSnap.data();
      console.log(`[JOIN] Game found:`, gameData);
    } else {
      // Demo mode
      gameData = await localGameStorage.getGame(cleanGameCode);
      if (!gameData) {
        throw new Error('Gra nie istnieje');
      }
    }
    
    if (gameData.status !== 'waiting') {
      throw new Error('Nie można dołączyć - gra już się rozpoczęła');
    }
    
    const teamId = `team-${Date.now()}`;
    const team = {
      id: teamId,
      name: teamName,
      joinedAt: new Date().toISOString(),
    };
    
    if (useFirebase) {
      const gameRef = doc(db, 'games', cleanGameCode);
      await updateDoc(gameRef, {
        teams: arrayUnion(team),
      });
    } else {
      // Demo mode
      const updatedTeams = [...(gameData.teams || []), team];
      await localGameStorage.updateGame(cleanGameCode, {
        teams: updatedTeams,
      });
    }
    
    console.log(`[JOIN] Successfully joined game ${cleanGameCode} as team "${teamName}"`);
    return { gameCode: cleanGameCode, gameId: cleanGameCode, teamId };
  } catch (error) {
    console.error('Error joining game:', error);
    throw error;
  }
};

// Rozpoczęcie gry (tylko host)
export const startGame = async (gameCode) => {
  if (useFirebase) {
    const gameRef = doc(db, 'games', gameCode);
    await updateDoc(gameRef, {
      status: 'playing',
    });
  } else {
    // Demo mode
    await localGameStorage.updateGame(gameCode, {
      status: 'playing',
    });
  }
};

// Wybór kategorii pytań (tylko host)
export const selectCategory = async (gameCode, category) => {
  console.log(`[SELECT] Setting category for game ${gameCode}: ${category}`);
  
  if (useFirebase) {
    const gameRef = doc(db, 'games', gameCode);
    await updateDoc(gameRef, {
      selectedCategory: category,
      categorySelectedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      buzzedTeam: null, // Która drużyna wcisnęła przycisk
      buzzTimestamp: null,
    });
    console.log(`[SELECT] Category ${category} saved to Firestore`);
  } else {
    // Demo mode
    await localGameStorage.updateGame(gameCode, {
      selectedCategory: category,
      categorySelectedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      buzzedTeam: null,
      buzzTimestamp: null,
    });
    console.log(`[SELECT] Category ${category} saved to local storage`);
  }
};

// Wciśnięcie przycisku przez drużynę (buzz)
export const buzzIn = async (gameCode, teamId, teamName) => {
  const timestamp = Date.now();
  console.log(`[BUZZ] Team ${teamName} (${teamId}) buzzed at ${timestamp}`);
  
  if (useFirebase) {
    const gameRef = doc(db, 'games', gameCode);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      
      // Tylko jeśli nikt jeszcze nie wcisnął
      if (!gameData.buzzedTeam) {
        await updateDoc(gameRef, {
          buzzedTeam: teamId,
          buzzedTeamName: teamName,
          buzzTimestamp: timestamp,
        });
        console.log(`[BUZZ] ${teamName} buzzed first!`);
        return { success: true, first: true };
      } else {
        console.log(`[BUZZ] ${teamName} was too slow`);
        return { success: true, first: false };
      }
    }
  } else {
    // Demo mode
    const gameData = await localGameStorage.getGame(gameCode);
    if (gameData && !gameData.buzzedTeam) {
      await localGameStorage.updateGame(gameCode, {
        buzzedTeam: teamId,
        buzzedTeamName: teamName,
        buzzTimestamp: timestamp,
      });
      return { success: true, first: true };
    }
    return { success: true, first: false };
  }
};

// Reset przycisku buzz (tylko host)
export const resetBuzz = async (gameCode) => {
  console.log(`[BUZZ] Resetting buzz for game ${gameCode}`);
  
  if (useFirebase) {
    const gameRef = doc(db, 'games', gameCode);
    await updateDoc(gameRef, {
      buzzedTeam: null,
      buzzedTeamName: null,
      buzzTimestamp: null,
    });
  } else {
    await localGameStorage.updateGame(gameCode, {
      buzzedTeam: null,
      buzzedTeamName: null,
      buzzTimestamp: null,
    });
  }
  console.log(`[BUZZ] Reset complete`);
};

// Aktualizacja poprawnej odpowiedzi
export const updateCorrectAnswer = async (gameCode, answer, points) => {
  const gameRef = doc(db, 'games', gameCode);
  await updateDoc(gameRef, {
    correctAnswers: arrayUnion(answer),
    totalPoints: points,
  });
};

// Aktualizacja błędnej odpowiedzi
export const updateWrongAnswer = async (gameCode, answer) => {
  const gameRef = doc(db, 'games', gameCode);
  const gameSnap = await getDoc(gameRef);
  const wrongAnswers = gameSnap.data().wrongAnswers || [];
  
  const updatedWrongAnswers = [...wrongAnswers, answer];
  if (updatedWrongAnswers.length > 5) {
    updatedWrongAnswers.shift();
  }
  
  await updateDoc(gameRef, {
    wrongAnswers: updatedWrongAnswers,
  });
};

// Transfer punktów do drużyny
export const transferPointsToTeam = async (gameCode, team, points, currentTeamScore) => {
  const gameRef = doc(db, 'games', gameCode);
  const fieldName = team === 'team1' ? 'team1Score' : 'team2Score';
  
  await updateDoc(gameRef, {
    [fieldName]: currentTeamScore + points,
    totalPoints: 0,
    correctAnswers: [],
    wrongAnswers: [],
    selectedTeam: null,
  });
};

// Następne pytanie
export const nextQuestion = async (gameCode, currentIndex, rounds) => {
  const gameRef = doc(db, 'games', gameCode);
  const nextIndex = currentIndex + 1;
  
  if (nextIndex < rounds.length) {
    await updateDoc(gameRef, {
      currentQuestionIndex: nextIndex,
      currentRound: rounds[nextIndex],
      correctAnswers: [],
      wrongAnswers: [],
      totalPoints: 0,
      selectedTeam: null,
    });
  }
};

// Wybór drużyny
export const selectTeam = async (gameCode, teamId) => {
  const gameRef = doc(db, 'games', gameCode);
  await updateDoc(gameRef, {
    selectedTeam: teamId,
  });
};

// Reset gry
export const resetGameData = async (gameCode) => {
  const gameRef = doc(db, 'games', gameCode);
  await updateDoc(gameRef, {
    team1Score: 0,
    team2Score: 0,
    currentQuestionIndex: 0,
    currentRound: questions[0],
    totalPoints: 0,
    correctAnswers: [],
    wrongAnswers: [],
    selectedTeam: null,
    status: 'waiting',
  });
};

// Nasłuchiwanie zmian w grze
export const subscribeToGame = (gameCode, callback) => {
  if (useFirebase) {
    const gameRef = doc(db, 'games', gameCode);
    return onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  } else {
    // Demo mode - użyj lokalnego storage
    // Wywołaj callback natychmiast z aktualnymi danymi (jeśli gra istnieje)
    localGameStorage.getGame(gameCode)
      .then(gameData => {
        if (gameData) {
          callback(gameData);
        }
      })
      .catch(err => {
        // Gra jeszcze nie istnieje - to normalne przy pierwszym renderze
        console.log(`[DEMO MODE] Waiting for game ${gameCode} to be created...`);
      });
    
    // Zwróć listener który będzie nasłuchiwał przyszłych zmian
    return localGameStorage.onGameChange(gameCode, callback);
  }
};

// Opuszczenie gry
export const leaveGame = async (gameCode, teamId) => {
  const gameRef = doc(db, 'games', gameCode);
  const gameSnap = await getDoc(gameRef);
  
  if (gameSnap.exists()) {
    const teams = gameSnap.data().teams || [];
    const updatedTeams = teams.filter(t => t.id !== teamId);
    
    await updateDoc(gameRef, {
      teams: updatedTeams,
    });
  }
};
