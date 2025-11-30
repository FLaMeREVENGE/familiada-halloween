"use client";
import '../css/index.css';
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <title>Familiada - Gra Online dla Znajomych</title>
        <meta name="description" content="Zagraj w Familiadę online z przyjaciółmi! Multiplayer quiz z pytaniami i odpowiedziami. Stwórz grę i zaproś znajomych!" />
        <meta name="keywords" content="familiada, gra online, quiz, multiplayer, gra dla znajomych, familiada online" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Familiada - Gra Online" />
        <meta property="og:description" content="Zagraj w Familiadę online z przyjaciółmi!" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
