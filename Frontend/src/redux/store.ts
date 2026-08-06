import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import storage from "redux-persist/lib/storage";

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

const persistConfig = {
    key: "auth",
    storage,
};

const persistedReducer = persistReducer(
    persistConfig,
    authReducer
);

export const store = configureStore({
    reducer: {
        auth: persistedReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<
    typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;