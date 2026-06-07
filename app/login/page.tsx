'use client'
import { usePostLoginRequestMutation } from '@/lib/api-slice';
import { LoginUserRequestBody } from '@/lib/types';
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required.'),
  password: yup
    .string()
    .required('Password is required.'),
});

export function LoginForm({ }: Readonly<{}>) {
  const searchParams = useSearchParams();
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
  const [postLoginRequest, { isLoading, isError }] = usePostLoginRequestMutation();

  // The path that user should be sent to after successful login
  const redirectPath = useMemo(() => {
    // Get the query param
    const redirectPathQueryParam = decodeURIComponent(searchParams.get('redirect_path') ?? '');
    // If query param isn't a path, return to root
    return redirectPathQueryParam?.startsWith('/') ? redirectPathQueryParam : '/';
  }, [searchParams])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Trigger call to login
        const loginRequestBody: LoginUserRequestBody = {
          username: values.username,
          password: values.password,
        }

        // Save session token
        const result = await postLoginRequest(loginRequestBody).unwrap();
        localStorage.setItem('sessionToken', result.session_token)

        // Send user to next route
        window.location.href = redirectPath;
      } catch (err: any) {
        setLoginErrorMessage(err.data.detail);
        console.error(`Failed to  login: ${JSON.stringify(err)}`);
      }
    },
  });

  return (
    <Box className='flex flex-col items-center'>
      <Box className='w-9/10 sm:w-sm p-5 rounded-lg' sx={{ boxShadow: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box className='flex flex-col gap-2'>

            <Typography variant='h1' className='text-2xl mb-2'>
              Login
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
              id='password'
              name='password'
              label='Password'
              type='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password || ' '}
            />

            {isLoading &&
              <CircularProgress aria-label='Loading…' className='mx-auto mb-5' />
            }

            {isError &&
              <Alert variant='outlined' severity='error' className='mb-5'>
                {loginErrorMessage || 'Something went wrong.'}
              </Alert>
            }

            <Button
              fullWidth
              color='primary'
              variant='contained'
              type='submit'
            >
              Login
            </Button>

            <Box className='mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between'>

              {/* TODO: Fix link */}
              <Link href='/'>
                Forgot password?
              </Link>

              {/* TODO: Fix link */}
              <Link href='/'>
                Create account
              </Link>
            </Box>

          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<CircularProgress aria-label='Loading…' className='mx-auto' />}>
      <LoginForm />
    </Suspense>
  );
}