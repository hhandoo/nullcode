// ThemeContext.js
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

export const ThemeContext = createContext();

const defaultSettings = {
    mode: 'system',
    color: 'blue',
    font: 'Courier New'
};

const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('app-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    const effectiveMode = settings.mode === 'system' ? getSystemTheme() : settings.mode;

    const theme = useMemo(() => createTheme({
        palette: {
            mode: effectiveMode,
            primary: {
                main: getColor(settings.color),
            }
        },
        typography: {
            fontFamily: settings.font,
        }
    }), [settings, effectiveMode]);

    useEffect(() => {
        localStorage.setItem('app-settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (updates) => setSettings(prev => ({ ...prev, ...updates }));

    return (
        <ThemeContext.Provider value={{ settings, updateSettings }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

// Helper
function getColor(color) {
    const map = {
        blue: '#1976d2',
        red: '#d32f2f',
        green: '#2e7d32',
        purple: '#6a1b9a',
        orange: '#ef6c00',
        lightBlue: '#90caf9',   // New light blue (Blue 200)
        lightRed: '#ef9a9a',    // New light red (Red 200)
        lightGreen: '#a5d6a7',  // New light green (Green 200)
        lightPurple: '#ce93d8', // New light purple (Purple 200)
    };
    return map[color] || '#1976d2';
}
