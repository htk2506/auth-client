import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from './types/user-model'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER_URL }),
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => `v1/users/me`,
        }),
    }),
})

// Export hooks for usage in functional components
export const { useGetCurrentUserQuery } = apiSlice