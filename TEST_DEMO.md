## Test Demo Mode

Otwórz http://localhost:3000 w przeglądarce

### Sprawdź konsolę (F12)

Powinieneś zobaczyć:
```
🔶 DEMO MODE: Firebase nie jest skonfigurowany. Używam lokalnego storage.
📝 Aby skonfigurować Firebase, przejdź do FIREBASE_SETUP.md
```

### Test flow:

1. **Strona główna (/)** → automatyczne przekierowanie do `/home`
2. **Wybierz "Stwórz grę"** → przekierowanie do `/host`
3. **Powinien pojawić się 4-cyfrowy kod** (np. A7K2)
4. **W nowej karcie/oknie** otwórz http://localhost:3000
5. **Wybierz "Dołącz do gry"**
6. **Wpisz kod z kroku 3**
7. **Podaj imię i wybierz drużynę**
8. **Kliknij "Dołącz"**

### Jeśli widzisz "Tworzenie gry..." bez końca:

1. Sprawdź konsolę (F12) - szukaj błędów
2. Sprawdź czy serwer działa: `http://localhost:3000`
3. Sprawdź terminal - szukaj błędów
4. Przeładuj stronę (Ctrl+Shift+R / Cmd+Shift+R)

### Debug:

Otwórz konsolę i wpisz:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

To wyczyści cache Redux i przeładuje stronę.
