import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api-slice';

export const makeStore = () => {
    const store = configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });
    setupListeners(store.dispatch);
    return store;
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']