import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from './types/user-model'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => `/me`,
        }),
    }),
})

// Export hooks for usage in functional components
export const { useGetCurrentUserQuery } = apiSlice