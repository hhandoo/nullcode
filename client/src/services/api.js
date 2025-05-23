// src/services/api.js

import axios from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from '../util/tokenUtils';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL,
            withCredentials: true, // allows sending cookies (for refresh token)
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

        // Refresh token if 401
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const { data } = await this.api.post('/auth/token/refresh/');
                        const newAccessToken = data.access;
                        setAccessToken(newAccessToken);
                        this.api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        removeAccessToken();
                        window.location.href = '/login'; // or use a custom logout handler
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
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

    // Handle image/file upload
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

    // For unauthenticated endpoints (override headers)
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
