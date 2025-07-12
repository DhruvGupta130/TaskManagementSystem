import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    userRole: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.userRole = action.payload.role;
        },
        logout: (state) => {
            state.token = null;
            state.userRole = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;