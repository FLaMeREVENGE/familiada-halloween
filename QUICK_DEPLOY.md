# 🚀 Quick Start - Deployment

## Najszybszy sposób wdrożenia (5 minut)

### 1. Upewnij się, że build działa
```bash
npm run build
```
✅ Build powinien przejść bez błędów (właśnie to zrobiliśmy!)

### 2. Push do GitHub
```bash
git add .
git commit -m "Production ready - add deployment configs"
git push origin feature/familiada-2-0-0
```

### 3. Merge do main (jeśli jesteś na branch)
```bash
git checkout main
git merge feature/familiada-2-0-0
git push origin main
```

### 4. Deploy na Vercel

#### Sposób 1: Przez stronę (zalecane dla pierwszego razu)
1. Otwórz https://vercel.com
2. Zaloguj się przez GitHub
3. Kliknij "Add New Project"
4. Wybierz `familiada-halloween`
5. Dodaj zmienne środowiskowe (skopiuj z `.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. Kliknij "Deploy"
7. Poczekaj 2-3 minuty
8. GOTOWE! 🎉

#### Sposób 2: Przez CLI
```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Zaloguj się
vercel login

# Deploy
vercel --prod

# Podczas pierwszego deployu, zostaniesz poproszony o:
# - Link to existing project? N
# - Project name: familiada-halloween
# - Directory: ./
# - Want to override settings? N

# Dodaj zmienne środowiskowe
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
# ... itd dla wszystkich zmiennych

# Redeploy z nowymi zmiennymi
vercel --prod
```

### 5. Zaktualizuj Firebase
1. Przejdź do https://console.firebase.google.com
2. Wybierz swój projekt
3. Authentication → Settings → Authorized domains
4. Dodaj swoją domenę Vercel (np. `familiada-halloween.vercel.app`)

### 6. Testuj!
Otwórz swój URL Vercel i przetestuj grę!

---

## Checklist przed publikacją

- [x] Build lokalnie działa (`npm run build`)
- [x] `.gitignore` zawiera `.env.local`
- [x] `vercel.json` utworzony
- [x] Metadata SEO dodane
- [x] `robots.txt` utworzony
- [ ] Zmienne środowiskowe w Vercel
- [ ] Domena dodana do Firebase Authorized domains
- [ ] Aplikacja przetestowana na produkcji

---

## Twój URL będzie wyglądał tak:
`https://familiada-halloween.vercel.app`

lub możesz dodać własną domenę w Vercel Settings!

---

## Potrzebujesz pomocy?
Sprawdź szczegóły w `DEPLOYMENT.md`
