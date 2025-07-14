import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './Auth/authSlice';
import { carApi } from './Car/carApi';
import { rentalApi } from './Rental/rentalApi';
import { customerApi } from './Customer/customerApi';
const store = configureStore({
    reducer: {
        auth: authReducer,
        [carApi.reducerPath]: carApi.reducer,
        [rentalApi.reducerPath]: rentalApi.reducer,
        [customerApi.reducerPath]: customerApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(carApi.middleware)
        .concat(rentalApi.middleware)
        .concat(customerApi.middleware),
});
// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
export default store;
