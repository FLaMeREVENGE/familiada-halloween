"use client";
import '../css/index.css';
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Podstawowe SEO */}
        <title>Familiada - Gra Familijna Online | Rozgrywka Multiplayer</title>
        <meta name="description" content="Zagraj w Familiadę online! Klasyczna teleturniejna gra rodzinna z trybem multiplayer. Zgaduj najpopularniejsze odpowiedzi i wygraj!" />
        <meta name="keywords" content="familiada, gra online, multiplayer, gra rodzinna, teleturniej, quiz, gra grupowa" />
        <meta name="author" content="Familiada Game" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Familiada - Gra Familijna Online" />
        <meta property="og:description" content="Zagraj w Familiadę online! Klasyczna teleturniejna gra rodzinna z trybem multiplayer." />
        <meta property="og:site_name" content="Familiada" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Familiada - Gra Familijna Online" />
        <meta name="twitter:description" content="Zagraj w Familiadę online! Klasyczna teleturniejna gra rodzinna z trybem multiplayer." />
        
        {/* Dodatkowo */}
        <meta name="theme-color" content="#264653" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
