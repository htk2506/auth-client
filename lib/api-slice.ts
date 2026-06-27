import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSessionToken, hasUnexpiredSessionToken } from './session-token-management';
import { LoginUserRequestBody, LoginUserResponseBody, User } from './types';

/**
 * Generates a value for an Authorization header using a bearer token.
 * @returns A string to use as Authorization header value.
 */
const generateAuthorizationHeader = () => {
    // Make sure there's an unexpired session token.
    if (!hasUnexpiredSessionToken()) {
        throw new Error("No unexpired session token found.");
    }

    // Retrieve session token from local storage
    const sessionToken = getSessionToken();

    // Return the header
    return `Bearer ${sessionToken}`;
}

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_SERVER_URL }),
    tagTypes: ['CurrentUser'],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => ({
                url: `v1/users/me`,
                headers: {
                    ['Authorization']: generateAuthorizationHeader(),
                },
            }),
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