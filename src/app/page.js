"use client";
import Game from "../container/Game";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const page = () => {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
};

export default page;
