import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import questionReducer from "./reducer/questionReducer";

const rootReducer = combineReducers({
  question: questionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["question"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };