import { DarkMode, LightMode } from '@mui/icons-material';
import { AppBar, createTheme, CssBaseline, Grid, IconButton, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../AppContext';

type PropsWithChildrenOnly = PropsWithChildren<unknown>;
export const DefaultLayout: FunctionComponent<PropsWithChildrenOnly> = ({ children }) => {
    const { isReady, mode, toggleMode } = useContext(AppContext);
    const navigate = useNavigate();
    const theme = createTheme({ palette: { mode } });

    if (!isReady) {
        return <></>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' sx={{ flexGrow: 1 }} onClick={() => navigate('/')}>
                        Todo
                    </Typography>
                    <IconButton size='large' color='inherit' onClick={toggleMode}>
                        {mode === 'light' ? <DarkMode /> : <LightMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} p={2}>
                {children}
            </Grid>
        </ThemeProvider>
    );
};
