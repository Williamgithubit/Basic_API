import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            // Get the token from the state
            const token = getState().auth.token;
            // If we have a token, add it to the headers
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        getCurrentUser: builder.query({
            query: () => '/auth/me',
        }),
    }),
});
export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
