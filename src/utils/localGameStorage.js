// Symulacja lokalnego storage dla trybu demo (bez Firebase)
class LocalGameStorage {
  constructor() {
    this.games = {};
    this.listeners = {};
  }

  // Tworzenie gry
  async createGame(gameCode, gameData) {
    this.games[gameCode] = { ...gameData };
    console.log(`[DEMO MODE] Created game: ${gameCode}`, gameData);
    return { success: true };
  }

  // Pobieranie gry
  async getGame(gameCode) {
    const game = this.games[gameCode];
    if (!game) {
      return null; // Zwróć null zamiast rzucać błąd
    }
    return game;
  }

  // Aktualizacja gry
  async updateGame(gameCode, updates) {
    if (!this.games[gameCode]) {
      throw new Error('Gra nie istnieje');
    }
    
    this.games[gameCode] = {
      ...this.games[gameCode],
      ...updates,
    };
    
    console.log(`[DEMO MODE] Updated game: ${gameCode}`, updates);
    
    // Powiadom słuchaczy
    if (this.listeners[gameCode]) {
      this.listeners[gameCode].forEach(callback => {
        callback(this.games[gameCode]);
      });
    }
    
    return { success: true };
  }

  // Nasłuchiwanie zmian
  onGameChange(gameCode, callback) {
    if (!this.listeners[gameCode]) {
      this.listeners[gameCode] = [];
    }
    this.listeners[gameCode].push(callback);
    
    // Zwróć funkcję do odsubskrybowania
    return () => {
      this.listeners[gameCode] = this.listeners[gameCode].filter(
        cb => cb !== callback
      );
    };
  }

  // Czyszczenie
  clearAll() {
    this.games = {};
    this.listeners = {};
  }
}

export const localGameStorage = new LocalGameStorage();
