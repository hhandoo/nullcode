import React, { createContext, useContext, useEffect, useState } from 'react';

const TimeContext = createContext(null);

export const TimeProvider = ({ children }) => {
    const [time, setTime] = useState({
        date: new Date(),
        unixTimestamp: Math.floor(Date.now() / 1000),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime({
                date: now,
                unixTimestamp: Math.floor(now.getTime() / 1000),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TimeContext.Provider value={time}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error('useTime must be used within a TimeProvider');
    }
    return context;
};
