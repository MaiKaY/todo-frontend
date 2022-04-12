import { SnackbarProvider } from 'notistack';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppContextProvider } from './AppContext';
import { Home } from './pages/Home';

export const App = (): React.ReactElement => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnReconnect: 'always',
                refetchOnWindowFocus: 'always'
            }
        }
    });
    return (
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Home />} />
                        </Routes>
                    </BrowserRouter>
                </SnackbarProvider>
            </AppContextProvider>
        </QueryClientProvider>
    );
};
