
'use client'
import { usePostCreateUserRequestMutation } from '@/lib/api-slice';
import { CreateUserRequestBody } from '@/lib/types';
import CreateIcon from '@mui/icons-material/Create';
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object({
    username: yup
        .string()
        .required(),
    email: yup
        .string()
        .email(),
    password: yup
        .string()
        .required(),
    passwordConfirmation: yup
        .string()
        .required('confirm password is a required field')
        .equals([yup.ref('password')], "password confirmation must match password"),
    note: yup
        .string(),
});

export default function CreateUserForm() {
    const [createUserErrorMessage, setCreateUserErrorMessage] = useState<string>('');
    const [postCreateUserRequest, {
        isLoading: createUserIsLoading,
        isError: createUserIsError,
        isSuccess: createUserIsSuccess,
    }] = usePostCreateUserRequestMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            note: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const createUserRequest: CreateUserRequestBody = {
                    username: values.username,
                    email: values.email.length > 0 ? values.email : null, // Send null in place of empty string
                    password: values.password,
                    note: values.note,
                }

                // Trigger call to create
                const result = await postCreateUserRequest(createUserRequest).unwrap();

            } catch (err: any) {
                console.error(`Failed to  create user: ${JSON.stringify(err)}`);

                setCreateUserErrorMessage(err?.data?.detail);

                const errorData = {
                    username: err?.data?.errors?.Username || null,
                    email: err?.data?.errors?.Email || null,
                    password: err?.data?.errors?.Password || null,
                    note: err?.data?.errors?.Note || null,
                }
                formik.setErrors(errorData);
            }
        },
    });

    return (
        <Box className='flex flex-col items-center'>
            <Box className='w-95/100 sm:w-sm md:w-md p-5 rounded-lg' sx={{ boxShadow: 1 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Box className='flex flex-col gap-2'>

                        <Typography variant='h1' className='text-2xl mb-2'>
                            Create Account
                        </Typography>

                        <TextField
                            fullWidth
                            id='username'
                            name='username'
                            label='Username'
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username || ' '}
                        />

                        <TextField
                            fullWidth
                            id='email'
                            name='email'
                            label='Email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email || ' '}
                        />

                        <TextField
                            fullWidth
                            id='password'
                            name='password'
                            label='Password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password || ' '}
                        />

                        <TextField
                            fullWidth
                            id='passwordConfirmation'
                            name='passwordConfirmation'
                            label='Confirm Password'
                            value={formik.values.passwordConfirmation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation || ' '}
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
                            error={formik.touched.note && Boolean(formik.errors.note)}
                            helperText={formik.touched.note && formik.errors.note || ' '}
                        />

                        {createUserIsLoading &&
                            <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                        }

                        {createUserIsSuccess &&
                            <Alert variant='outlined' severity='info' className='mb-5'>
                                Account creation was successful.
                            </Alert>
                        }

                        {createUserIsError &&
                            <Alert variant='outlined' severity='error' className='mb-5'>
                                {createUserErrorMessage || 'Something went wrong.'}
                            </Alert>
                        }

                        {!createUserIsSuccess &&
                            <Box className='flex flex-row items-center gap-2 mb-4'>

                                <Button
                                    startIcon={<CreateIcon />}
                                    fullWidth
                                    color='primary'
                                    variant='contained'
                                    type='submit'
                                    disabled={!formik.dirty || !formik.isValid}
                                >
                                    Create
                                </Button>
                            </Box>
                        }

                        <Box className='flex flex-col flex-row justify-center'>
                            <Link href={'/login'}>
                                Login
                            </Link>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
