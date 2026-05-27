import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LoginUserRequestBody, LoginUserResponseBody, User } from './types'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_SERVER_URL }),
    tagTypes: ['CurrentUser'],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => `v1/users/me`,
            providesTags: ['CurrentUser'],
        }),
        postLoginRequest: builder.mutation<LoginUserResponseBody, LoginUserRequestBody>({
            query: (loginRequest) => ({
                url: `v1/sessions/login`,
                method: 'POST',
                body: loginRequest,
            }),
            invalidatesTags: ['CurrentUser'],
        }),
    }),
})

// Export hooks for usage in functional components
export const {
    useGetCurrentUserQuery,
    usePostLoginRequestMutation,
} = apiSlice