// Zestawy pytań podzielone na kategorie i poziomy trudności
const questionSets = [
  // ZESTAW 1: Wiedza ogólna - Łatwy
  {
    category: "Wiedza ogólna",
    difficulty: "easy",
    questions: [
      {
        question: "Co można znaleźć w lodówce?",
        answers: [
          "Mleko",
          "Jajka",
          "Ser",
          "Masło",
          "Wędliny",
          "Warzywa",
          "Jogurt",
        ],
      },
      {
        question: "Zwierzę, które często trzymamy w domu",
        answers: [
          "Pies",
          "Kot",
          "Rybki",
          "Chomik",
          "Papuga",
          "Królik",
        ],
      },
      {
        question: "Co robisz zaraz po przebudzeniu?",
        answers: [
          "Wyłączam budzik",
          "Idę do łazienki",
          "Myję zęby",
          "Piję kawę",
          "Ubieram się",
        ],
      },
      {
        question: "Popularne zawody",
        answers: [
          "Lekarz",
          "Nauczyciel",
          "Policjant",
          "Sprzedawca",
          "Programista",
          "Kierowca",
          "Kucharz",
        ],
      },
      {
        question: "Co kupujemy w piekarni?",
        answers: [
          "Chleb",
          "Bułki",
          "Rogale",
          "Drożdżówki",
          "Ciasto",
          "Baguette",
        ],
      },
    ],
  },

  // ZESTAW 2: Rozrywka - Średni
  {
    category: "Rozrywka",
    difficulty: "medium",
    questions: [
      {
        question: "Popularny gatunek filmowy",
        answers: [
          "Komedia",
          "Akcja",
          "Horror",
          "Dramat",
          "Sci-Fi",
          "Romans",
          "Thriller",
        ],
      },
      {
        question: "Co robimy w kinie?",
        answers: [
          "Oglądamy film",
          "Jemy popcorn",
          "Pijemy napoje",
          "Siedzimy cicho",
          "Śmiejemy się",
        ],
      },
      {
        question: "Popularne gry planszowe",
        answers: [
          "Monopoly",
          "Scrabble",
          "Eurobiznes",
          "Warcaby",
          "Szachy",
          "Chińczyk",
          "Karty",
        ],
      },
      {
        question: "Instrument muzyczny",
        answers: [
          "Gitara",
          "Fortepian",
          "Perkusja",
          "Skrzypce",
          "Flet",
          "Trąbka",
          "Saksofon",
        ],
      },
      {
        question: "Co ludzie robią na koncercie?",
        answers: [
          "Słuchają muzyki",
          "Tańczą",
          "Śpiewają",
          "Biją brawo",
          "Machają rękami",
          "Robią zdjęcia",
        ],
      },
    ],
  },

  // ZESTAW 3: Sport - Trudny
  {
    category: "Sport",
    difficulty: "hard",
    questions: [
      {
        question: "Dyscyplina olimpijska",
        answers: [
          "Bieg",
          "Pływanie",
          "Skok wzwyż",
          "Pchnięcie kulą",
          "Rzut oszczepem",
          "Gimnastyka",
          "Zapasy",
          "Wioślarstwo",
        ],
      },
      {
        question: "Sprzęt używany w tenisie",
        answers: [
          "Rakieta",
          "Piłka",
          "Siatka",
          "Kort",
          "Opaska na głowę",
        ],
      },
      {
        question: "Znani polscy sportowcy",
        answers: [
          "Robert Lewandowski",
          "Adam Małysz",
          "Kamil Stoch",
          "Justyna Kowalczyk",
          "Anita Włodarczyk",
          "Wojciech Szczęsny",
        ],
      },
      {
        question: "Co robi piłkarz podczas meczu?",
        answers: [
          "Biega",
          "Strzela gole",
          "Podaje piłkę",
          "Broni",
          "Atakuje",
          "Cieszy się",
          "Dostaje kartki",
        ],
      },
      {
        question: "Sportowe obuwie",
        answers: [
          "Buty piłkarskie",
          "Adidasy",
          "Kolce",
          "Halówki",
          "Buty do biegania",
          "Tenisówki",
        ],
      },
    ],
  },
];

// Funkcja zwracająca listę dostępnych kategorii (dla UI wyboru)
export const getAvailableCategories = () => {
  return questionSets.map((set) => ({
    category: set.category,
    difficulty: set.difficulty,
  }));
};

// Funkcja zwracająca pytania dla wybranej kategorii
export const getQuestionsByCategory = (category) => {
  const set = questionSets.find((s) => s.category === category);
  return set ? set.questions : [];
};

// Export domyślny dla kompatybilności wstecznej
const questions = questionSets[0].questions;

export { questionSets };
export default questions;
