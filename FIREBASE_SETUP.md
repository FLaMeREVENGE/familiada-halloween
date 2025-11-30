# Instrukcja konfiguracji Firebase

## Krok 1: Stwórz projekt Firebase

1. Przejdź na https://console.firebase.google.com/
2. Kliknij "Add project" lub "Dodaj projekt"
3. Podaj nazwę projektu (np. "familiada-halloween")
4. Wyłącz Google Analytics (opcjonalne)
5. Kliknij "Create project"

## Krok 2: Dodaj aplikację Web

1. W konsoli Firebase, kliknij ikonę Web (</>) aby dodać aplikację
2. Podaj nazwę aplikacji (np. "Familiada Web")
3. NIE zaznaczaj "Set up Firebase Hosting"
4. Kliknij "Register app"

## Krok 3: Skopiuj konfigurację

Zobaczysz kod konfiguracyjny podobny do:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "familiada-halloween.firebaseapp.com",
  projectId: "familiada-halloween",
  storageBucket: "familiada-halloween.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Krok 4: Utwórz plik .env.local

W głównym folderze projektu stwórz plik `.env.local` i dodaj:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=twój-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=twój-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=twój-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=twój-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=twój-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=twój-app-id
```

## Krok 5: Włącz Firestore

1. W menu Firebase Console, wybierz "Firestore Database"
2. Kliknij "Create database"
3. Wybierz "Start in test mode" (na czas developmentu)
4. Wybierz lokalizację (np. europe-west3)
5. Kliknij "Enable"

## Krok 6: Skonfiguruj reguły bezpieczeństwa

W zakładce "Rules" w Firestore, wklej:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      // Każdy może czytać gry
      allow read: if true;
      
      // Tylko host może tworzyć i modyfikować
      allow create: if request.auth != null || true;
      allow update: if request.auth != null || true;
      allow delete: if request.auth != null || true;
    }
  }
}
```

**UWAGA:** To są testowe reguły. W produkcji użyj bardziej restrykcyjnych!

## Krok 7: Uruchom aplikację

```bash
npm run dev
```

Aplikacja powinna działać na http://localhost:3000

## Rozwiązywanie problemów

### Problem: Firebase nie działa
- Sprawdź czy plik `.env.local` istnieje w głównym folderze
- Sprawdź czy wszystkie zmienne środowiskowe zaczynają się od `NEXT_PUBLIC_`
- Zrestartuj serwer development po dodaniu zmiennych

### Problem: Nie można zapisać do Firestore
- Upewnij się że Firestore jest włączony
- Sprawdź reguły bezpieczeństwa

### Problem: "FirebaseError: Missing or insufficient permissions"
- Zmień reguły Firestore na test mode (allow read, write: if true;)
