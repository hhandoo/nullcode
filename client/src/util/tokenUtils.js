// src/utils/tokenUtils.js

const ACCESS_TOKEN_KEY = 'accessToken';

export const setAccessToken = (token, rememberMe = true) => {
    if (rememberMe) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
};

export const getAccessToken = () => {
    // Check sessionStorage first then localStorage (optional)
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};
