import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import questionReducer from "./reducer/questionReducer";
import gameReducer from "./reducer/gameSlice";

const rootReducer = combineReducers({
  question: questionReducer,
  game: gameReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["question", "game"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };