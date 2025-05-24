// src/services/api.js

import axios from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from '../util/tokenUtils';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const { REACT_APP_REGENERATE_TOKENS } = process.env;

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
}

function handle401Error(apiInstance, error, REGENERATE_TOKENS) {
    const originalRequest = error.config;

    if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;

            return apiInstance.post(REGENERATE_TOKENS, {}, { withCredentials: true })
                .then(({ data }) => {
                    const newAccessToken = data.access;
                    setAccessToken(newAccessToken);
                    apiInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    onRefreshed(newAccessToken);
                    return apiInstance(originalRequest);
                })
                .catch((refreshError) => {
                    removeAccessToken();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                resolve(apiInstance(originalRequest));
            });
        });
    }

    return Promise.reject(error);
}

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Attach token before every request
        this.api.interceptors.request.use((config) => {
            const token = getAccessToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });

        // Handle 401 errors and refresh token
        this.api.interceptors.response.use(
            (response) => response,
            (error) => handle401Error(this.api, error, REACT_APP_REGENERATE_TOKENS)
        );
    }

    get(url, config = {}) {
        return this.api.get(url, config);
    }

    post(url, data = {}, config = {}) {
        return this.api.post(url, data, config);
    }

    put(url, data = {}, config = {}) {
        return this.api.put(url, data, config);
    }

    delete(url, config = {}) {
        return this.api.delete(url, config);
    }

    upload(url, file, fieldName = 'file', additionalData = {}) {
        const formData = new FormData();
        formData.append(fieldName, file);
        for (let key in additionalData) {
            formData.append(key, additionalData[key]);
        }

        return this.api.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    publicGet(url, config = {}) {
        const newConfig = { ...config };
        delete newConfig.headers?.Authorization;
        return axios.get(`${baseURL}${url}`, {
            ...newConfig,
            withCredentials: true,
        });
    }

    publicPost(url, data = {}, config = {}) {
        const newConfig = { ...config };
        delete newConfig.headers?.Authorization;
        return axios.post(`${baseURL}${url}`, data, {
            ...newConfig,
            withCredentials: true,
        });
    }
}

const apiService = new ApiService();
export default apiService;
