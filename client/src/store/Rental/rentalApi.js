import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const rentalApi = createApi({
    reducerPath: 'rentalApi',
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
    tagTypes: ['Rental'],
    endpoints: (builder) => ({
        getRentals: builder.query({
            query: () => '/rentals',
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: 'Rental', id })),
                    { type: 'Rental', id: 'LIST' },
                ]
                : [{ type: 'Rental', id: 'LIST' }],
        }),
        getRentalById: builder.query({
            query: (id) => `/rentals/${id}`,
            providesTags: (result, error, id) => [{ type: 'Rental', id }],
        }),
        getCustomerRentals: builder.query({
            query: (customerId) => `/rentals/customer/${customerId}`,
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: 'Rental', id })),
                    { type: 'Rental', id: 'CUSTOMER' },
                ]
                : [{ type: 'Rental', id: 'CUSTOMER' }],
        }),
        getCarRentals: builder.query({
            query: (carId) => `/rentals/car/${carId}`,
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: 'Rental', id })),
                    { type: 'Rental', id: 'CAR' },
                ]
                : [{ type: 'Rental', id: 'CAR' }],
        }),
        createRental: builder.mutation({
            query: (rental) => ({
                url: '/rentals',
                method: 'POST',
                body: rental,
            }),
            invalidatesTags: [
                { type: 'Rental', id: 'LIST' },
                { type: 'Rental', id: 'CUSTOMER' },
                { type: 'Rental', id: 'CAR' },
            ],
        }),
        updateRental: builder.mutation({
            query: ({ id, ...rental }) => ({
                url: `/rentals/${id}`,
                method: 'PUT',
                body: rental,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Rental', id },
                { type: 'Rental', id: 'LIST' },
                { type: 'Rental', id: 'CUSTOMER' },
                { type: 'Rental', id: 'CAR' },
            ],
        }),
        cancelRental: builder.mutation({
            query: (id) => ({
                url: `/rentals/${id}/cancel`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Rental', id },
                { type: 'Rental', id: 'LIST' },
                { type: 'Rental', id: 'CUSTOMER' },
                { type: 'Rental', id: 'CAR' },
            ],
        }),
        completeRental: builder.mutation({
            query: (id) => ({
                url: `/rentals/${id}/complete`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Rental', id },
                { type: 'Rental', id: 'LIST' },
                { type: 'Rental', id: 'CUSTOMER' },
                { type: 'Rental', id: 'CAR' },
            ],
        }),
    }),
});
export const { useGetRentalsQuery, useGetRentalByIdQuery, useGetCustomerRentalsQuery, useGetCarRentalsQuery, useCreateRentalMutation, useUpdateRentalMutation, useCancelRentalMutation, useCompleteRentalMutation, } = rentalApi;
