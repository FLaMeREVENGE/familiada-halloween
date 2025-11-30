"use client";
import '../css/index.css';
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <title>Familiada HALLOWEEN 2.0</title>
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
