import api from "../api/api.js";

export const refreshToken = async () => {
    try {
        const res = await api.post('/auth/refresh', null, {
            withCredentials: true,
        });
        const {accessToken, role} = res.data.data;
        return {accessToken, role};
    } catch (error) {
        console.error('❌ Refresh token failed', error);
        throw error;
    }
};