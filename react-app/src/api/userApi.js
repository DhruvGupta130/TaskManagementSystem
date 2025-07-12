import api from "./api.js";

export const fetchCurrentUser = async () => {
    const res = await api.get('/users/me');
    return res.data;
};


export const updateUser = async (data) => {
    const res = await api.put(`/users/update`, data);
    return res.data;
};

export const logoutUser = async () => {
    return api.post('/auth/logout');
};