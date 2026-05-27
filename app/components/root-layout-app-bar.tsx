'use client'
import { useGetCurrentUserQuery } from '@/lib/api-slice';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

function ToolBarContent() {
    const currentPath = usePathname();
    const searchParams = useSearchParams();
    const {
        data: currentUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCurrentUserQuery()
    const currentUrl = useMemo(() => {
        return (typeof window !== 'undefined') ? window.location.href : '';
    }, [searchParams, currentPath]);

    const callbackUrl = useMemo(() => {
        // Get the query param
        const callbackUrlQueryParam = decodeURIComponent(searchParams.get('callback_url') ?? '');
        // If callback URL isn't a path, return to root
        return callbackUrlQueryParam?.startsWith('/') ? callbackUrlQueryParam : '/';
    }, [searchParams])

    const loginPath = '/login'
    console.log(currentUrl);

    // TODO: Use whole URL instead of just path
    const loginUrl = `${loginPath}?callback_url=${encodeURIComponent(currentPath)}`

    // TODO: If already on login path, repass the login callback

    // TODO: Add check that a session token is stored before fetching current user

    return (
        <>
            {/* TODO: Add functionality to menu button */}
            <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                className='mr-2'
            >
                <MenuIcon />
            </IconButton>

            <Typography variant='h6' className='grow'>
                Welcome
            </Typography>

            {/* TODO: Make button change to logout if signed in already */}
            <Button href={loginUrl} color='inherit'>
                Login
            </Button>
        </>
    );
}

export function RootLayoutAppBar() {
    return (
        <AppBar position='sticky'>
            <Toolbar variant='dense'>
                <Suspense>
                    <ToolBarContent />
                </Suspense>
            </Toolbar>
        </AppBar>
    );
}
