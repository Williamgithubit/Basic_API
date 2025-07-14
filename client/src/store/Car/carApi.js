import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const carApi = createApi({
    reducerPath: 'carApi',
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
    tagTypes: ['Car'],
    endpoints: (builder) => ({
        getCars: builder.query({
            query: () => '/cars',
            providesTags: (result) => result
                ? [
                    ...result.map(({ id }) => ({ type: 'Car', id })),
                    { type: 'Car', id: 'LIST' },
                ]
                : [{ type: 'Car', id: 'LIST' }],
        }),
        getCarById: builder.query({
            query: (id) => `/cars/${id}`,
            providesTags: (result, error, id) => [{ type: 'Car', id }],
        }),
        getAvailableCars: builder.query({
            query: ({ startDate, endDate }) => ({
                url: '/cars/available',
                params: { startDate, endDate },
            }),
            providesTags: [{ type: 'Car', id: 'AVAILABLE' }],
        }),
        toggleLike: builder.mutation({
            query: (id) => ({
                url: `/cars/${id}/like`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Car', id },
                { type: 'Car', id: 'LIST' },
            ],
        }),
        addCar: builder.mutation({
            query: (car) => ({
                url: '/cars',
                method: 'POST',
                body: car,
            }),
            invalidatesTags: [{ type: 'Car', id: 'LIST' }],
        }),
        updateCar: builder.mutation({
            query: ({ id, ...car }) => ({
                url: `/cars/${id}`,
                method: 'PUT',
                body: car,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Car', id },
                { type: 'Car', id: 'LIST' },
            ],
        }),
        deleteCar: builder.mutation({
            query: (id) => ({
                url: `/cars/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Car', id },
                { type: 'Car', id: 'LIST' },
            ],
        }),
    }),
});
export const { useGetCarsQuery, useGetCarByIdQuery, useGetAvailableCarsQuery, useToggleLikeMutation, useAddCarMutation, useUpdateCarMutation, useDeleteCarMutation, } = carApi;
