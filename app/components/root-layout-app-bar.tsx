'use client'
import { useGetCurrentUserQuery } from '@/lib/api-slice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, CircularProgress, IconButton, Popover, Toolbar, Typography } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

function LoginContent() {
    const LOGIN_BASE_PATH = '/login'
    const currentPath = usePathname();
    const searchParams = useSearchParams();
    const {
        data: currentUser,
        isLoading: getCurrentUserIsLoading,
        isSuccess: getCurrentUserIsSuccess,
        isError: getCurrentUserIsError,
        error: getCurrentUserError,
    } = useGetCurrentUserQuery()
    const [loginButtonRedirectPath, setLoginButtonRedirectPath] = useState<string>(LOGIN_BASE_PATH); // Where the login button should redirect to
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);

    // The current URL the browser is at
    const currentUrl = useMemo(() => {
        return (typeof window !== 'undefined') ? window.location.href : '';
    }, [searchParams, currentPath]);

    // The current path the browser is at, including the query params
    const currentPathAndParams = useMemo(() => {
        // Remove the http:// or https:// protocol
        const currentHostAndPath = currentUrl.replace(/https?:\/\//, '');
        // Slice the path after the hostname 
        return currentHostAndPath.slice(currentHostAndPath.indexOf('/')) || '/';
    }, [currentUrl]);

    // The path specified by the redirect_path query param (can be included if browers is already at login page)
    const redirectPathFromQuery = useMemo(() => {
        // Get the query param
        const redirectPathQueryParam = decodeURIComponent(searchParams.get('redirect_path') ?? '');
        // If query param isn't a path, return to root
        return redirectPathQueryParam?.startsWith('/') ? redirectPathQueryParam : '/';
    }, [searchParams])

    // Set the path the login button will redirect to
    useEffect(() => {
        // Determine the path browser should redirect to after a successful login.
        // If browser is already on the login page, use the pre-existing redirect_path query parameter.
        // Otherwise, the browser should redirect back to the current page.
        const redirectPathAfterLogin = (currentPath === LOGIN_BASE_PATH) ? redirectPathFromQuery : currentPathAndParams;
        // Add the redirect path for following successful login as a query parameter
        const loginRedirectPath = `${LOGIN_BASE_PATH}?redirect_path=${encodeURIComponent(redirectPathAfterLogin)}`
        // Save path that will be used by the login button
        setLoginButtonRedirectPath(loginRedirectPath);
    }, [currentPath, redirectPathFromQuery, currentPathAndParams]);

    // Sets the popover's anchor
    const handleClickShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPopoverAnchorEl(event.currentTarget);
    };

    // Removes the popover's anchor
    const handleClosePopover = () => {
        setPopoverAnchorEl(null);
    };

    const isPopoverOpen = Boolean(popoverAnchorEl);
    const popoverId = isPopoverOpen ? 'account-popover' : undefined;

    // Renders the login/logout button and indicator for whether user is currently logged in
    const renderLoginFeatures = () => {
        if (getCurrentUserIsLoading) {
            return (
                <CircularProgress aria-label='Loading…' color='inherit' size='20px' />
            );
        }

        if (getCurrentUserIsSuccess) {
            return (
                <>
                    <IconButton
                        onClick={handleClickShowPopover}
                        color='inherit'
                        size='large'
                        edge='end'
                    >
                        <AccountCircleIcon />
                    </IconButton>

                    <Popover
                        id={popoverId}
                        open={isPopoverOpen}
                        anchorEl={popoverAnchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box className='p-2'>
                            <Typography >{currentUser.username}</Typography>

                            {/* TODO: Make logout button do logout functionality*/}
                            <Button href={loginButtonRedirectPath} >
                                Logout
                            </Button>
                        </Box>
                    </Popover>
                </>
            );
        } else {
            return (
                <Button href={loginButtonRedirectPath} color='inherit'>
                    Login
                </Button>
            );
        }
    }

    return (
        <>
            {renderLoginFeatures()}
        </>
    );
}

export function RootLayoutAppBar() {
    return (
        <AppBar position='sticky'>
            <Toolbar variant='dense'>

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

                <Suspense fallback={<CircularProgress aria-label='Loading…' color='inherit' size='20px' />}>
                    <LoginContent />
                </Suspense>

            </Toolbar>
        </AppBar>
    );
}
