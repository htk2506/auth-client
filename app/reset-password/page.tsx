
'use client'
import { usePostPasswordResetRequestMutation } from '@/lib/api-slice';
import { PATHS } from '@/lib/paths';
import { PasswordResetRequestBody } from '@/lib/types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as yup from 'yup';

interface ResetPasswordFormProps {
    setResetPasswordIsSuccessCallback: Dispatch<SetStateAction<boolean>>
}

function ResetPasswordForm({ setResetPasswordIsSuccessCallback }: ResetPasswordFormProps) {
    const [resetPasswordErrorMessage, setResetPasswordErrorMessage] = useState<string>('');
    const [postPasswordResetRequestMutation, {
        isLoading: resetPasswordIsLoading,
        isError: resetPasswordIsError,
        isSuccess: resetPasswordIsSuccess,
    }] = usePostPasswordResetRequestMutation();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Toggles whether or not to show password plain text
    const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword);

    // Keep caller updated with whether a password update happened
    useEffect(() => {
        setResetPasswordIsSuccessCallback(resetPasswordIsSuccess);
    }, [resetPasswordIsSuccess]);

    const resetPasswordValidationSchema = yup.object({
        email: yup
            .string()
            .required()
            .email(),
        resetToken: yup
            .string()
            .required(),
        newPassword: yup
            .string()
            .required(),
        newPasswordConfirmation: yup
            .string()
            .required()
            .equals([yup.ref('newPassword')], "password confirmation must match new password"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
            resetToken: '',
            newPassword: '',
            newPasswordConfirmation: '',
        },
        validationSchema: resetPasswordValidationSchema,
        onSubmit: async (values) => {
            try {
                const resetPasswordRequest: PasswordResetRequestBody = {
                    email: values.email,
                    password_reset_token: values.resetToken,
                    new_password: values.newPassword,
                }

                // Trigger call to reset password
                const result = await postPasswordResetRequestMutation(resetPasswordRequest).unwrap();
            } catch (err: any) {
                console.error(`Failed to reset password: ${JSON.stringify(err)}`);
                setResetPasswordErrorMessage(err?.data?.detail);
                const errorData = {
                    email: err?.data?.errors?.Email || null,
                    resetToken: err?.data?.errors?.PasswordResetToken || null,
                    newPassword: err?.data?.errors?.NewPassword || null,
                }
                formik.setErrors(errorData);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box className='flex flex-col gap-4'>

                <Typography>
                    Resetting your password will log you out of other sessions.
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

                <TextField
                    fullWidth
                    id='resetToken'
                    name='resetToken'
                    label='Password Reset Token'
                    value={formik.values.resetToken}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.resetToken && Boolean(formik.errors.resetToken)}
                    helperText={formik.touched.resetToken && formik.errors.resetToken || ' '}
                />

                <TextField
                    fullWidth
                    id='newPassword'
                    name='newPassword'
                    label='New Password'
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword || ' '}
                    slotProps={{
                        input: {
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }
                    }}
                />

                <TextField
                    fullWidth
                    id='newPasswordConfirmation'
                    name='newPasswordConfirmation'
                    label='Confirm New Password'
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.newPasswordConfirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newPasswordConfirmation && Boolean(formik.errors.newPasswordConfirmation)}
                    helperText={formik.touched.newPasswordConfirmation && formik.errors.newPasswordConfirmation || ' '}
                    slotProps={{
                        input: {
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }
                    }}
                />

                {resetPasswordIsLoading &&
                    <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                }

                {resetPasswordIsSuccess &&
                    <Alert variant='outlined' severity='info' className='mb-5'>
                        Password update was successful.
                    </Alert>
                }

                {resetPasswordIsError &&
                    <Alert variant='outlined' severity='error' className='mb-5'>
                        {resetPasswordErrorMessage || 'Something went wrong.'}
                    </Alert>
                }

                <Box className='flex flex-row items-center mb-4'>
                    <Button
                        startIcon={<LockResetIcon />}
                        fullWidth
                        color='primary'
                        variant='contained'
                        type='submit'
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </form>
    );
}

export default function ResetPasswordPage() {
    const [resetPasswordIsSuccess, setResetPasswordIsSuccess] = useState<boolean>(false);

    // Password was reset
    if (resetPasswordIsSuccess) {
        return (
            <Box className='flex flex-col items-center'>
                <Alert variant='outlined' className='mb-5'>
                    Password was reset.
                </Alert>
                <Link href={PATHS.LOGIN}>
                    Login
                </Link>
            </Box>
        );
    }

    // Display form
    return (
        <Box className='flex flex-col items-center mb-10'>
            <Box className='w-95/100 sm:w-sm md:w-md p-5 rounded-lg' sx={{ boxShadow: 1 }}>
                <Typography variant='h1' className='text-2xl mb-2'>
                    Reset Password
                </Typography>
                <ResetPasswordForm
                    setResetPasswordIsSuccessCallback={setResetPasswordIsSuccess}
                />
            </Box>
        </Box>
    );
}
