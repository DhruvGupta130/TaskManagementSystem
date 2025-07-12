export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
export const WS_BASE_URL = BACKEND_URL.replace(/^http/, 'ws');

export const API_BASE_URL = `${BACKEND_URL}/api`;
export const WEBSOCKET_URL = `${WS_BASE_URL}/ws/notification`;