import axios from "axios";
import { refreshToken } from "../utils/refreshToken";
import { API_BASE_URL } from "./config.js";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(token)
    );
    failedQueue = [];
};

// 🔐 Request Interceptor — Add Bearer token
export const injectInterceptors = (login, logout, getToken) => {
    api.interceptors.request.use((config) => {
        const token = getToken?.();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // 🔁 Response Interceptor — Auto refresh on 401
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const { config, response } = error;

            const isAuthError = response?.status === 401;
            const shouldRetry =
                isAuthError &&
                !config._retry &&
                !config.url.includes("/auth/refresh");

            if (!shouldRetry) return Promise.reject(error);

            config._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    config.headers.Authorization = `Bearer ${token}`;
                    return api(config);
                });
            }

            isRefreshing = true;

            try {
                const { accessToken, role } = await refreshToken();
                login(accessToken, role);
                processQueue(null, accessToken);

                config.headers.Authorization = `Bearer ${accessToken}`;
                return api(config);
            } catch (err) {
                processQueue(err);
                logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
    );
};

export default api;