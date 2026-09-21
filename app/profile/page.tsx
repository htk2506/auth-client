
'use client'
import { useDeleteUserRequestMutation, useGetCurrentUserQuery, usePutUpdateUserPasswordRequestMutation, usePutUpdateUserRequestMutation } from '@/lib/api-slice';
import { PATHS } from '@/lib/paths';
import { UpdateUserPasswordRequestBody, UpdateUserRequestBody, User } from '@/lib/types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as yup from 'yup';

interface UserFormProps {
    user: User,
}

function UserForm({ user }: UserFormProps) {
    const [updateUserErrorMessage, setUpdateUserErrorMessage] = useState<string>('');
    const [putUpdateUserRequest, {
        isLoading: updateUserIsLoading,
        isError: updateUserIsError,
        isSuccess: updateUserIsSuccess,
    }] = usePutUpdateUserRequestMutation();

    const userFormValidationSchema = yup.object({
        username: yup
            .string()
            .required(),
        email: yup
            .string()
            .email(),
        note: yup
            .string(),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user?.username || '',
            email: user?.email || '',
            note: user?.note || '',
        },
        validationSchema: userFormValidationSchema,
        onSubmit: async (values) => {
            try {
                const updateUserRequest: UpdateUserRequestBody = {
                    username: values.username,
                    email: values.email.length > 0 ? values.email : null, // Send null in place of empty string
                    note: values.note,
                }

                // Trigger call to update
                const result = await putUpdateUserRequest(updateUserRequest).unwrap();
            } catch (err: any) {
                console.error(`Failed to update: ${JSON.stringify(err)}`);

                setUpdateUserErrorMessage(err?.data?.detail);

                const errorData = {
                    username: err?.data?.errors?.Username || null,
                    email: err?.data?.errors?.Email || null,
                    note: err?.data?.errors?.Note || null,
                }
                formik.setErrors(errorData);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box className='flex flex-col gap-2'>

                <Typography variant='h2' className='text-xl mb-2'>
                    Account Information
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

                {updateUserIsLoading &&
                    <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                }

                {updateUserIsSuccess &&
                    <Alert variant='outlined' severity='info' className='mb-5'>
                        Update was successful.
                    </Alert>
                }

                {updateUserIsError &&
                    <Alert variant='outlined' severity='error' className='mb-5'>
                        {updateUserErrorMessage || 'Something went wrong.'}
                    </Alert>
                }

                <Box className='flex flex-row items-center gap-2 mb-4'>
                    <Button
                        startIcon={<DeleteIcon />}
                        fullWidth
                        color='error'
                        variant='outlined'
                        disabled={!formik.dirty}
                        onClick={() => {
                            formik.resetForm();
                        }}
                    >
                        Discard
                    </Button>

                    <Button
                        startIcon={<SaveIcon />}
                        fullWidth
                        color='primary'
                        variant='contained'
                        type='submit'
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </form>
    );
}

interface DeleteFormProps {
    user: User,
    setDeleteUserIsSuccessCallback: Dispatch<SetStateAction<boolean>>
}

function DeleteForm({ user, setDeleteUserIsSuccessCallback }: DeleteFormProps) {
    const [deleteUserErrorMessage, setDeleteUserErrorMessage] = useState<string>('');
    const [deleteUserRequest, {
        isLoading: deleteUserIsLoading,
        isError: deleteUserIsError,
        isSuccess: deleteUserIsSuccess,
    }] = useDeleteUserRequestMutation();

    // Keep caller updated with whether a user deletion happened
    useEffect(() => {
        setDeleteUserIsSuccessCallback(deleteUserIsSuccess);
    }, [deleteUserIsSuccess]);

    const deleteFormValidationSchema = yup.object({
        username: yup
            .string()
            .required(),
        usernameConfirmation: yup
            .string()
            .equals([yup.ref('username')], "username confirmation must match username"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user?.username || '',
            usernameConfirmation: '',
        },
        validationSchema: deleteFormValidationSchema,
        onSubmit: async (values) => {
            try {
                // Trigger call to delete
                const result = await deleteUserRequest().unwrap();
            } catch (err: any) {
                console.error(`Failed to delete: ${JSON.stringify(err)}`);
                setDeleteUserErrorMessage(err?.data?.detail);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box className='flex flex-col gap-4'>

                <Typography variant='h2' className='text-xl'>
                    Delete Account
                </Typography>

                <Typography>
                    Enter your username to delete your account. This will log you out.
                </Typography>

                <TextField
                    fullWidth
                    id='usernameConfirmation'
                    name='usernameConfirmation'
                    label='Username Confirmation'
                    value={formik.values.usernameConfirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.usernameConfirmation && Boolean(formik.errors.usernameConfirmation)}
                    helperText={formik.touched.usernameConfirmation && formik.errors.usernameConfirmation || ' '}
                />

                {deleteUserIsLoading &&
                    <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                }

                {deleteUserIsSuccess &&
                    <Alert variant='outlined' severity='info' className='mb-5'>
                        Deletion was successful.
                    </Alert>
                }

                {deleteUserIsError &&
                    <Alert variant='outlined' severity='error' className='mb-5'>
                        {deleteUserErrorMessage || 'Something went wrong.'}
                    </Alert>
                }

                <Box className='flex flex-row items-center mb-4'>
                    <Button
                        startIcon={<DangerousIcon />}
                        fullWidth
                        type='submit'
                        color='error'
                        variant='contained'
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>
        </form>
    );
}

interface UpdatePasswordFormProps {
    user: User,
    setUpdatePasswordIsSuccessCallback: Dispatch<SetStateAction<boolean>>
}

function UpdatePasswordForm({ user, setUpdatePasswordIsSuccessCallback }: UpdatePasswordFormProps) {
    const [updatePasswordErrorMessage, setUpdatePasswordErrorMessage] = useState<string>('');
    const [putUpdateUserPasswordRequestMutation, {
        isLoading: updatePasswordIsLoading,
        isError: updatePasswordIsError,
        isSuccess: updatePasswordIsSuccess,
    }] = usePutUpdateUserPasswordRequestMutation();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Toggles whether or not to show password plain text
    const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword);

    // Keep caller updated with whether a password update happened
    useEffect(() => {
        setUpdatePasswordIsSuccessCallback(updatePasswordIsSuccess);
    }, [updatePasswordIsSuccess]);

    const updatePasswordValidationSchema = yup.object({
        currentPassword: yup
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
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
        },
        validationSchema: updatePasswordValidationSchema,
        onSubmit: async (values) => {
            try {
                const updateUserPasswordRequest: UpdateUserPasswordRequestBody = {
                    current_password: values.currentPassword,
                    new_password: values.newPassword,
                }

                // Trigger call to update password
                const result = await putUpdateUserPasswordRequestMutation(updateUserPasswordRequest).unwrap();
            } catch (err: any) {
                console.error(`Failed to update password: ${JSON.stringify(err)}`);
                setUpdatePasswordErrorMessage(err?.data?.detail);
                const errorData = {
                    currentPassword: err?.data?.errors?.CurrentPassword || null,
                    newPassword: err?.data?.errors?.NewPassword || null,
                }
                formik.setErrors(errorData);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box className='flex flex-col gap-4'>

                <Typography variant='h2' className='text-xl'>
                    Update Password
                </Typography>

                <Typography>
                    Updating your password will log you out.
                </Typography>

                <TextField
                    fullWidth
                    id='currentPassword'
                    name='currentPassword'
                    label='Current Password'
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword || ' '}
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

                {updatePasswordIsLoading &&
                    <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
                }

                {updatePasswordIsSuccess &&
                    <Alert variant='outlined' severity='info' className='mb-5'>
                        Password update was successful.
                    </Alert>
                }

                {updatePasswordIsError &&
                    <Alert variant='outlined' severity='error' className='mb-5'>
                        {updatePasswordErrorMessage || 'Something went wrong.'}
                    </Alert>
                }

                <Box className='flex flex-row items-center mb-4'>
                    <Button
                        startIcon={<SaveIcon />}
                        fullWidth
                        color='primary'
                        variant='contained'
                        type='submit'
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Update Password
                    </Button>
                </Box>
            </Box>
        </form>
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
    const [deleteUserIsSuccess, setDeleteUserIsSuccess] = useState<boolean>(false);
    const [updatePasswordIsSuccess, setUpdatePasswordIsSuccess] = useState<boolean>(false);

    // Loading user info placeholder
    if (getCurrentUserIsLoading) {
        return (
            <Box className='flex flex-col items-center'>
                <CircularProgress aria-label='Loading…' color='inherit' size='20px' />
            </Box>
        );
    }

    // Loading user info had an error
    if (getCurrentUserIsError || !currentUser) {

        // Not actually an error, user was just deleted
        if (deleteUserIsSuccess) {
            return (
                <Box className='flex flex-col items-center'>
                    <Alert variant='outlined' className='mb-5'>
                        Account was deleted.
                    </Alert>
                    <Link href={PATHS.LOGIN}>
                        Login
                    </Link>
                </Box>
            );
        }

        // Not actually an error, password was updated
        if (updatePasswordIsSuccess) {
            return (
                <Box className='flex flex-col items-center'>
                    <Alert variant='outlined' className='mb-5'>
                        Password was updated.
                    </Alert>
                    <Link href={PATHS.LOGIN}>
                        Login
                    </Link>
                </Box>
            );
        }

        // Generic error message
        return (
            <Box className='flex flex-col items-center'>
                <Alert variant='outlined' severity='error' className='mb-5'>
                    {(getCurrentUserError as SerializedError)?.message || 'Something went wrong.'}
                </Alert>
                <Link href={PATHS.LOGIN}>
                    Login
                </Link>
            </Box>
        );
    }

    // Display forms
    return (
        <Box className='flex flex-col items-center mb-10'>
            <Box className='w-95/100 sm:w-sm md:w-md p-5 rounded-lg' sx={{ boxShadow: 1 }}>
                <Typography variant='h1' className='text-2xl mb-2'>
                    Profile
                </Typography>
                <UserForm user={currentUser} />
                <Divider className='my-4' />
                <UpdatePasswordForm
                    user={currentUser}
                    setUpdatePasswordIsSuccessCallback={setUpdatePasswordIsSuccess}
                />
                <Divider className='my-4' />
                <DeleteForm
                    user={currentUser}
                    setDeleteUserIsSuccessCallback={setDeleteUserIsSuccess}
                />
            </Box>
        </Box>);
}
