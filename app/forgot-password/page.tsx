
'use client'
import { usePostStartPasswordResetRequestMutation } from '@/lib/api-slice';
import { PATHS } from '@/lib/paths';
import { StartPasswordResetRequestBody } from '@/lib/types';
import EmailIcon from '@mui/icons-material/Email';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';

export default function ForgotPasswordPage() {
    const [resetPasswordPath, setResetPasswordPath] = useState<string>(PATHS.RESET_PASSWORD);
    const [startPasswordResetErrorMessage, setStartPasswordResetErrorMessage] = useState<string>('');
    const [postStartPasswordResetRequest, {
        isLoading: startPasswordResetIsLoading,
        isError: startPasswordResetIsError,
        isSuccess: startPasswordResetIsSuccess,
    }] = usePostStartPasswordResetRequestMutation();

    const startPasswordResetValidationSchema = yup.object({
        email: yup
            .string()
            .required()
            .email(),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
        },
        validationSchema: startPasswordResetValidationSchema,
        onSubmit: async (values) => {
            try {
                const startPasswordResetRequest: StartPasswordResetRequestBody = {
                    email: values.email,
                }

                // Trigger call to start password reset
                const result = await postStartPasswordResetRequest(startPasswordResetRequest).unwrap();

                // Generate path for redirecting to password reset
                setResetPasswordPath(`${PATHS.RESET_PASSWORD}?email=${encodeURIComponent(startPasswordResetRequest.email)}`);
            } catch (err: any) {
                console.error(`Failed to request password reset: ${JSON.stringify(err)}`);

                setStartPasswordResetErrorMessage(err?.data?.detail);

                const errorData = {
                    email: err?.data?.errors?.Email || null,
                }
                formik.setErrors(errorData);
            }
        },
    });

    // Display 
    return (
        <Box className='flex flex-col items-center mb-10'>
            <Box className='w-95/100 sm:w-sm md:w-md p-5 rounded-lg' sx={{ boxShadow: 1 }}>
                <Typography variant='h1' className='text-2xl mb-2'>
                    Forgot Password
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Box className='flex flex-col gap-4'>

                        <Typography variant='h2' className='text-xl'>
                            Request Password Reset
                        </Typography>

                        <Typography>
                            A reset token will be sent to your email if it is associated with an account.
                        </Typography>

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

                        {startPasswordResetIsLoading &&
                            <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                        }

                        {startPasswordResetIsError &&
                            <Alert variant='outlined' severity='error' className='mb-5'>
                                {startPasswordResetErrorMessage || 'Something went wrong.'}
                            </Alert>
                        }

                        <Box className='flex flex-row items-center mb-4'>
                            <Button
                                startIcon={<EmailIcon />}
                                fullWidth
                                color='primary'
                                variant='contained'
                                type='submit'
                                disabled={!formik.dirty || !formik.isValid}
                            >
                                {startPasswordResetIsSuccess ? 'Resend Email' : 'Send Email'}
                            </Button>
                        </Box>


                        {startPasswordResetIsSuccess &&
                            <Alert variant='outlined' severity='info' className='mb-5'>
                                Check your email and spam folder for the reset token.
                            </Alert>
                        }

                        {startPasswordResetIsSuccess &&
                            <Box className='flex flex-row items-center mb-4'>
                                <Button
                                    startIcon={<NavigateNextIcon />}
                                    fullWidth
                                    color='primary'
                                    variant='contained'
                                    href={resetPasswordPath}
                                >
                                    I have received the token
                                </Button>
                            </Box>
                        }

                    </Box>
                </form>
            </Box>
        </Box>
    );
}
