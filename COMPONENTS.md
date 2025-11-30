# Familiada - System Komponentów

## 🎨 Paleta Kolorów

### Kolory Podstawowe
- **Charcoal Blue** (`#264653`) - Granatowy z węgielskim odcieniem
- **Verdigris** (`#2a9d8f`) - Turkusowo-zielony kolor
- **Jasmine** (`#e9c46a`) - Złoty odcień
- **Sandy Brown** (`#f4a261`) - Pomarańczowo-brązowy
- **Burnt Peach** (`#e76f51`) - Ognisty brzoskwiniowy

### Użycie Kolorów
```css
--charcoal-blue: #264653;
--verdigris: #2a9d8f;
--jasmine: #e9c46a;
--sandy-brown: #f4a261;
--burnt-peach: #e76f51;
```

## 📝 Czcionka
Projekt używa czcionki **BPdots** jako podstawowej czcionki dla całej aplikacji.

---

## 🧩 Komponenty

### 1. Button (Przycisk)
Uniwersalny komponent przycisku z różnymi wariantami.

#### Import
```jsx
import { Button } from '@/components';
```

#### Użycie
```jsx
<Button 
  variant="primary"      // primary | secondary | accent | danger | outline
  size="medium"          // small | medium | large
  onClick={handleClick}
  icon="🎮"
  disabled={false}
>
  Kliknij mnie
</Button>
```

#### Warianty
- `primary` - Gradient turkusowo-granatowy (główne akcje)
- `secondary` - Gradient pomarańczowo-brzoskwiniowy
- `accent` - Gradient złoto-pomarańczowy (akcenty)
- `danger` - Gradient czerwono-brzoskwiniowy (akcje niebezpieczne)
- `outline` - Przezroczyste tło z obramowaniem

#### Rozmiary
- `small` - Mniejszy przycisk
- `medium` - Standardowy rozmiar (domyślny)
- `large` - Większy przycisk

---

### 2. Card (Karta)
Komponent kontenera z zaokrąglonymi rogami i cieniem.

#### Import
```jsx
import { Card } from '@/components';
```

#### Użycie
```jsx
<Card 
  variant="default"    // default | primary | accent | glass | solid
  hoverable={true}     // Efekt hover
  onClick={handleClick}
>
  <h2>Tytuł karty</h2>
  <p>Treść karty</p>
</Card>
```

#### Warianty
- `default` - Ciemny gradient (domyślny)
- `primary` - Gradient turkusowo-granatowy
- `accent` - Gradient ze złotym akcentem
- `glass` - Efekt szkła (glassmorphism)
- `solid` - Solidny kolor bez przezroczystości

---

### 3. Text (Tekst)
Komponent tekstowy z predefiniowanymi stylami.

#### Import
```jsx
import { Text } from '@/components';
```

#### Użycie
```jsx
<Text 
  variant="h1"         // h1 | h2 | h3 | body | small | caption
  color="default"      // default | primary | accent | secondary | danger | charcoal
  align="center"       // left | center | right
>
  Treść tekstu
</Text>
```

#### Warianty
- `h1` - Główny nagłówek (4rem)
- `h2` - Drugi nagłówek (2.5rem)
- `h3` - Trzeci nagłówek (1.8rem)
- `body` - Treść główna (1.2rem)
- `small` - Mały tekst (1rem)
- `caption` - Podpis (0.9rem)

#### Kolory
- `default` - Biały
- `primary` - Turkusowy (#2a9d8f)
- `accent` - Złoty (#e9c46a)
- `secondary` - Pomarańczowy (#f4a261)
- `danger` - Brzoskwiniowy (#e76f51)
- `charcoal` - Granatowy (#264653)

---

### 4. Table (Tabela)
Komponent tabeli z responsywnym designem.

#### Import
```jsx
import { Table } from '@/components';
```

#### Użycie
```jsx
<Table 
  variant="default"    // default | striped | bordered | compact
  headers={['Kolumna 1', 'Kolumna 2', 'Kolumna 3']}
  rows={[
    ['Wiersz 1, Kom 1', 'Wiersz 1, Kom 2', 'Wiersz 1, Kom 3'],
    ['Wiersz 2, Kom 1', 'Wiersz 2, Kom 2', 'Wiersz 2, Kom 3'],
  ]}
/>
```

#### Warianty
- `default` - Standardowa tabela
- `striped` - Przemienne kolory wierszy
- `bordered` - Z obramowaniem komórek
- `compact` - Mniejsze odstępy

---

### 5. Badge (Odznaka)
Mały element do wyświetlania statusów lub liczników.

#### Import
```jsx
import { Badge } from '@/components';
```

#### Użycie
```jsx
<Badge 
  variant="primary"    // primary | accent | secondary | outline
  size="medium"        // small | medium | large
>
  Nowy
</Badge>
```

#### Warianty
- `primary` - Gradient turkusowo-granatowy
- `accent` - Gradient złoto-pomarańczowy
- `secondary` - Gradient pomarańczowo-brzoskwiniowy
- `outline` - Przezroczyste tło z obramowaniem

---

## 🎯 Przykłady Użycia

### Formularz logowania
```jsx
import { Card, Text, Button } from '@/components';

<Card variant="glass">
  <Text variant="h2" align="center" color="accent">
    Dołącz do gry
  </Text>
  
  <input type="text" placeholder="Wpisz kod gry" />
  
  <Button variant="primary" size="large">
    Dołącz
  </Button>
</Card>
```

### Lista wyników
```jsx
import { Card, Text, Table, Badge } from '@/components';

<Card variant="primary">
  <Text variant="h2" color="accent">
    Wyniki gry
  </Text>
  
  <Table 
    variant="striped"
    headers={['Drużyna', 'Punkty', 'Status']}
    rows={[
      ['Drużyna 1', '500', <Badge variant="primary">Wygrana</Badge>],
      ['Drużyna 2', '300', <Badge variant="secondary">Przegrana</Badge>],
    ]}
  />
</Card>
```

### Panel kontrolny hosta
```jsx
import { Button, Badge } from '@/components';

<div className="controls">
  <Badge variant="accent" size="large">
    Pytanie 3/5
  </Badge>
  
  <Button variant="danger" icon="✖" onClick={addWrong}>
    Błędna odpowiedź
  </Button>
  
  <Button variant="primary" icon="✓" onClick={revealAnswer}>
    Odkryj odpowiedź
  </Button>
</div>
```

---

## 🚀 Export wszystkich komponentów

```jsx
import { 
  Button, 
  Card, 
  Text, 
  Table, 
  Badge 
} from '@/components';
```

---

## 📱 Responsywność

Wszystkie komponenty są w pełni responsywne i dostosowują się do rozmiaru ekranu. Na urządzeniach mobilnych:
- Przyciski i karty dostosowują rozmiar
- Tabele stają się przewijalne (scroll horizontal)
- Tekst skaluje się odpowiednio

---

## 🎨 Customizacja

Możesz nadpisać style komponentów używając właściwości `className`:

```jsx
<Button className="my-custom-button">
  Custom Button
</Button>
```

Lub użyć CSS variables z `:root` dla globalnych zmian kolorów.
