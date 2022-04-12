import { useMediaQuery } from '@mui/material';
import React, { createContext, FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

type AppContextType = {
    isReady: boolean;
    mode: Mode;
    toggleMode: () => void;
};

export const AppContext = createContext<AppContextType>({
    isReady: false,
    mode: 'light',
    toggleMode: () => ({})
});

type PropsWithChildrenOnly = PropsWithChildren<unknown>;
export const AppContextProvider: FunctionComponent<PropsWithChildrenOnly> = ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [isReady, setIsReady] = useState(false);
    const [mode, setMode] = useState<Mode>('light');

    useEffect(() => {
        const storedMode = window.localStorage.getItem('todo:mode');
        if (storedMode) {
            setMode(storedMode === 'dark' ? 'dark' : 'light');
        } else {
            setMode(prefersDarkMode ? 'dark' : 'light');
        }
        setIsReady(true);
    }, [prefersDarkMode]);

    const toggleMode = () => {
        const updatedMode = mode === 'dark' ? 'light' : 'dark';
        window.localStorage.setItem('todo:mode', updatedMode);
        setMode(updatedMode);
    };

    return (
        <AppContext.Provider
            value={{
                isReady,
                mode,
                toggleMode
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
