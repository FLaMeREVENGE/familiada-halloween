import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import questionReducer from "./reducer/questionReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["question"],
};

const persistedReducer = persistReducer(persistConfig, questionReducer);

const store = configureStore({
  reducer: {
    question: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };