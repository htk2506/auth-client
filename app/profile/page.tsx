
'use client'
import { useGetCurrentUserQuery } from '@/lib/api-slice';
import { User } from '@/lib/types';
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object({
    username: yup
        .string()
        .required('Username is required.'),
    email: yup
        .string()
        .email(),
    note: yup
        .string(),
});

interface UserFormProps {
    user: User,
}

export function UserForm({ user }: UserFormProps) {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [updateUserErrorMessage, setUpdateUserErrorMessage] = useState<string>('');

    // Toggles whether or not to show password plain text
    const handleClickSetEditMode = () => setIsEditMode((isEditMode) => !isEditMode);

    const formik = useFormik({
        initialValues: {
            username: user?.username || '',
            email: user?.email || '',
            note: user?.note || '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // TODO: Trigger call to update

            } catch (err: any) {
                setUpdateUserErrorMessage(err.data.detail);
                console.error(`Failed to  update: ${JSON.stringify(err)}`);
            }
        },
    });

    return (
        <Box className='flex flex-col items-center'>
            <Box className='w-95/100 sm:w-sm md:w-md p-5 rounded-lg' sx={{ boxShadow: 1 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Box className='flex flex-col gap-2'>

                        <Typography variant='h1' className='text-2xl mb-2'>
                            Profile
                        </Typography>


                        <Box className='flex flex-row items-center gap-2 mb-4 sm:px-2'>
                            <Typography>
                                ID:
                            </Typography>
                            <Typography className='rounded-sm bg-current/10 py-1 px-2'>
                                {user.id}
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            id='username'
                            name='username'
                            label='Username'
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.errors.username)}
                            helperText={formik.errors.username || ' '}
                        />

                        <TextField
                            fullWidth
                            id='email'
                            name='email'
                            label='Email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.errors.email)}
                            helperText={formik.errors.email || ' '}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            id='note'
                            name='note'
                            label='Note'
                            value={formik.values.note}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.errors.note)}
                            helperText={formik.errors.note || ' '}
                        />

                        {/* {isLoading &&
                            <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                        }

                        {isError &&
                            <Alert variant='outlined' severity='error' className='mb-5'>
                                {loginErrorMessage || 'Something went wrong.'}
                            </Alert>
                        } */}

                        <Button
                            fullWidth
                            color='primary'
                            variant='contained'
                            type='submit'
                        >
                            Edit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default function ProfilePage() {
    const {
        data: currentUser,
        isLoading: getCurrentUserIsLoading,
        isSuccess: getCurrentUserIsSuccess,
        isError: getCurrentUserIsError,
        error: getCurrentUserError,
    } = useGetCurrentUserQuery();

    if (getCurrentUserIsLoading) { // Loading placeholder
        <Box className='flex flex-col items-center'>
            <CircularProgress aria-label='Loading…' color='inherit' size='20px' />
        </Box>
    }
    else { // Once info has loaded
        if (getCurrentUserIsError || !currentUser) { // If there was an error
            return (
                <Box className='flex flex-col items-center'>

                    <Alert variant='outlined' severity='error' className='mb-5'>
                        {(getCurrentUserError as SerializedError)?.message || 'Something went wrong.'}
                    </Alert>

                    <Link href='/login'>
                        Login
                    </Link>

                </Box>
            );
        } else { // Display user form
            return (
                <UserForm user={currentUser} />
            );
        }
    }
}
