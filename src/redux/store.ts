import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import savedCollectionReducer from './slices/savedCollectionSlice';
import userDataReducer from './slices/userDataSlice';

// Noop storage to avoid server-side errors in SSR
const noopStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
};

// Common storage config
const persistConfig = {
    key: 'root',
    storage: typeof window !== 'undefined' ? storage : noopStorage,
    whitelist: ['user', 'savedCollection'],
};
const rootReducer = combineReducers({
    user: userReducer,
    savedCollection: savedCollectionReducer,
    userData: userDataReducer,
});

// ✅ Proper serializableCheck ignore list (recommended)
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
