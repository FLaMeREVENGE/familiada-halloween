# 🚀 Przewodnik Wdrożenia - Familiada

## Przygotowanie do publikacji

### 1. Weryfikacja Firebase

#### A. Sprawdź konfigurację Firebase
Upewnij się, że masz plik `.env.local` z właściwymi danymi Firebase:
```bash
cat .env.local
```

#### B. Zaktualizuj reguły Firestore dla produkcji
W Firebase Console (https://console.firebase.google.com):
1. Przejdź do **Firestore Database** → **Rules**
2. Zastąp obecne reguły następującymi (bardziej bezpieczne):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Gry - każdy może tworzyć i czytać, ale tylko przez API
    match /games/{gameCode} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['code', 'createdAt']);
      allow update: if true;
      allow delete: if false;
    }
  }
}
```

#### C. Włącz automatyczne czyszczenie starych gier (opcjonalne)
Firebase nie ma automatycznego TTL, ale możesz:
- Używać Cloud Functions do czyszczenia gier starszych niż 24h
- Lub zaakceptować, że stare gry pozostaną w bazie (nieaktywne)

---

### 2. Weryfikacja kompilacji lokalnej

Zbuduj aplikację lokalnie, aby upewnić się, że nie ma błędów:

```bash
npm run build
```

Jeśli build się powiedzie, przetestuj wersję produkcyjną:

```bash
npm start
```

Otwórz http://localhost:3000 i przetestuj podstawowe funkcje.

---

## Wdrożenie na Vercel (REKOMENDOWANE) ⚡

Vercel to najlepsza platforma dla Next.js (tworzona przez twórców Next.js).

### Krok 1: Przygotowanie repozytorium

Upewnij się, że masz wszystkie zmiany w Git:

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Krok 2: Połącz z Vercel

1. Przejdź na https://vercel.com
2. Zaloguj się przez GitHub
3. Kliknij **"Add New Project"**
4. Wybierz repozytorium `familiada-halloween`
5. Vercel automatycznie wykryje, że to projekt Next.js

### Krok 3: Skonfiguruj zmienne środowiskowe

W Vercel Project Settings → **Environment Variables**, dodaj:

```
NEXT_PUBLIC_FIREBASE_API_KEY=twoj-klucz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=twoj-projekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=twoj-projekt-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=twoj-projekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=twoj-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=twoj-app-id
```

### Krok 4: Deploy!

1. Kliknij **"Deploy"**
2. Vercel automatycznie zbuduje i wdroży aplikację
3. Po ~2-3 minutach otrzymasz publiczny URL, np:
   - `https://familiada-halloween.vercel.app`
   - lub własną domenę (możesz dodać w Settings)

### Krok 5: Testowanie produkcji

1. Otwórz URL Vercel
2. Przetestuj kompletny flow gry:
   - Stwórz grę jako host
   - Dołącz jako 2 drużyny
   - Zagraj rundę
   - Sprawdź czy Firebase działa (dane się synchronizują)

---

## Alternatywa: Netlify 🎯

### Deployment na Netlify

1. Przejdź na https://netlify.com
2. Zaloguj się przez GitHub
3. Kliknij **"Add new site"** → **"Import from Git"**
4. Wybierz repozytorium

**Build settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Base directory: (zostaw puste)

**Environment Variables:**
Dodaj te same zmienne Firebase co dla Vercel.

5. Kliknij **"Deploy site"**

---

## Alternatywa: Firebase Hosting 🔥

### Deployment na Firebase Hosting

1. Zainstaluj Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Zaloguj się do Firebase:
```bash
firebase login
```

3. Zainicjuj Firebase Hosting:
```bash
firebase init hosting
```

Wybierz opcje:
- Public directory: `out`
- Configure as single-page app: `No`
- Set up automatic builds: `No`

4. Zaktualizuj `package.json` - dodaj skrypt:
```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

5. Zbuduj statyczną wersję:
```bash
npm run export
```

6. Deploy:
```bash
firebase deploy --only hosting
```

---

## Po wdrożeniu ✅

### 1. Zaktualizuj Firebase Console
Dodaj domenę produkcyjną do **Authorized domains**:
- Firebase Console → Authentication → Settings → Authorized domains
- Dodaj: `twoja-domena.vercel.app` lub własną domenę

### 2. Monitorowanie
- **Vercel Dashboard**: Zobacz logi, metryki, analytics
- **Firebase Console**: Monitoruj użycie Firestore
- **Google Analytics** (opcjonalnie): Dodaj tracking

### 3. Własna domena (opcjonalnie)

#### W Vercel:
1. Settings → Domains
2. Dodaj własną domenę (np. `familiada.example.com`)
3. Zaktualizuj DNS zgodnie z instrukcjami Vercel

---

## Optymalizacje produkcyjne 🚀

### 1. Dodaj robots.txt
Stwórz `public/robots.txt`:
```
User-agent: *
Allow: /
```

### 2. Dodaj metadata SEO
W `src/app/layout.js`, zaktualizuj metadata:
```javascript
export const metadata = {
  title: 'Familiada - Gra Online',
  description: 'Zagraj w Familiadę online z przyjaciółmi!',
  keywords: 'familiada, gra, quiz, online, multiplayer'
}
```

### 3. Monitoring błędów (opcjonalnie)
Dodaj Sentry lub podobne narzędzie do śledzenia błędów.

---

## Rozwiązywanie problemów 🔧

### Problem: Firebase nie działa na produkcji
- Sprawdź czy zmienne środowiskowe są ustawione w Vercel/Netlify
- Zweryfikuj reguły Firestore
- Sprawdź Authorized domains w Firebase Console

### Problem: Strona nie ładuje się
- Sprawdź logi w Vercel Dashboard
- Upewnij się, że `npm run build` działa lokalnie
- Sprawdź czy wszystkie zależności są w `package.json`

### Problem: Redux Persist błąd
- To normalne w środowisku serverless - ignoruj ostrzeżenia

---

## Szybki checklist przed publikacją ✓

- [ ] Lokalny build działa (`npm run build`)
- [ ] Plik `.env.local` ma poprawne dane Firebase
- [ ] Reguły Firestore są zaktualizowane
- [ ] Kod jest w repozytorium Git
- [ ] Zmienne środowiskowe dodane w Vercel/Netlify
- [ ] Aplikacja przetestowana na produkcji
- [ ] Domena dodana do Firebase Authorized domains

---

## Gotowe! 🎉

Twoja gra jest teraz dostępna publicznie. Możesz udostępnić link znajomym i grać!

**Następne kroki:**
- Udostępnij link w social media
- Zbierz feedback od użytkowników
- Dodaj nowe kategorie pytań
- Rozważ dodanie więcej funkcji (ranking, historia gier, etc.)
