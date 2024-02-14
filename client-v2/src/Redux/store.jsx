import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { rootPersistConfig, rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (GetDefaultMiddleware) =>
    GetDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persist = persistStore(store);

export const { dispatch } = store;

export const useSelector = useAppSelector;

export const useDispatch = useAppDispatch;
