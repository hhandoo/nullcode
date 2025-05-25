import axios from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from '../util/tokenUtils';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
export const REGENERATE_TOKENS = process.env.REACT_APP_REGENERATE_TOKENS || '/auth/token/refresh/';

let isRefreshing = false;
let refreshSubscribers = [];

let setIsAuthenticatedCallback = null;

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
}

function rejectSubscribers() {
    refreshSubscribers.forEach(cb => cb(null));
    refreshSubscribers = [];
}

function handle401Error(apiInstance, error) {
    const originalRequest = error.config;

    if (!originalRequest || !originalRequest.headers || error.response?.status !== 401) {
        return Promise.reject(error);
    }

    if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;

            return apiInstance.post(REGENERATE_TOKENS, {}, { withCredentials: true })
                .then(({ data }) => {
                    const newAccessToken = data.access;
                    setAccessToken(newAccessToken);

                    if (setIsAuthenticatedCallback) {
                        setIsAuthenticatedCallback(true);
                    }

                    onRefreshed(newAccessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return apiInstance(originalRequest);
                })
                .catch((refreshError) => {
                    removeAccessToken();
                    if (setIsAuthenticatedCallback) {
                        setIsAuthenticatedCallback(false);
                    }

                    rejectSubscribers();

                    return Promise.reject(refreshError);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        return new Promise((resolve, reject) => {
            subscribeTokenRefresh((newToken) => {
                if (!newToken) {
                    reject(new Error('Token refresh failed'));
                } else {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(apiInstance(originalRequest));
                }
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

        this.api.interceptors.request.use((config) => {
            const token = getAccessToken();

            // Prevent sending access token to the refresh endpoint
            const isRefreshUrl = config.url?.includes(REGENERATE_TOKENS);

            if (token && !isRefreshUrl) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => handle401Error(this.api, error)
        );
    }

    // Allow external injection of authentication handler
    setAuthCallback(cb) {
        setIsAuthenticatedCallback = cb;
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

        return this.api.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    publicGet(url, config = {}) {
        const newConfig = { ...config };
        if (newConfig.headers && newConfig.headers.Authorization) {
            delete newConfig.headers.Authorization;
        }
        return axios.get(`${baseURL}${url}`, {
            ...newConfig,
            withCredentials: true,
        });
    }

    publicPost(url, data = {}, config = {}) {
        const newConfig = { ...config };
        if (newConfig.headers && newConfig.headers.Authorization) {
            delete newConfig.headers.Authorization;
        }
        return axios.post(`${baseURL}${url}`, data, {
            ...newConfig,
            withCredentials: true,
        });
    }
}

const apiService = new ApiService();
export default apiService;
