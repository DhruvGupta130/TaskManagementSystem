import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const login = (credentials) => axios.post(`${API_URL}/auth/login`, credentials);
export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const getTasks = (userId, token) => axios.get(`${API_URL}/tasks/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
export const getTaskUser = (taskId, token) => axios.get(`${API_URL}/tasks/user/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
export const getAllTasks = (token) => axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
export const createTask = (task, token) => axios.post(`${API_URL}/tasks`, task, { headers: { Authorization: `Bearer ${token}`} });
export const getTaskById = (taskId, token) => axios.get(`${API_URL}/tasks/task/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
export const updateTask = (taskId, task, token) => axios.put(`${API_URL}/tasks/${taskId}`, task, { headers: { Authorization: `Bearer ${token}` } });
export const deleteTask = (taskId) => axios.delete(`${API_URL}/tasks/${taskId}`);
export const getAllNotifications = (userId) => axios.get(`${API_URL}/notifications/all/${userId}`);
export const getUnreadNotifications = (userId) => axios.get(`${API_URL}/notifications/${userId}`);
export const readNotifications = (userId) => axios.get(`${API_URL}/notifications/get/${userId}`);
export const userDetails = (token) => axios.get(`${API_URL}/users/me`, {headers: {Authorization: `Bearer ${token}`}});
export const getAllUsers = (token) => axios.get(`${API_URL}/users/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
export const createUser = (user, token) => axios.post(`${API_URL}/users/admin/users`, user, { headers: { Authorization: `Bearer ${token}`} });
export const getUserById = (userId, token) => axios.get(`${API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
export const updatePassword = (password, token) => axios.put(`${API_URL}/auth/change`, password, {headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },});
export const updateUser = (userId, user, token) => axios.put(`${API_URL}/users/admin/users/${userId}`, user, { headers: { Authorization: `Bearer ${token}`} });
export const deleteUser = (userId, token) => axios.delete(`${API_URL}/users/admin/users/${userId}`,{headers: {Authorization: `Bearer ${token}`}});
