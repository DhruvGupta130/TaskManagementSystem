// src/api/managerApi.js
import api from './api';

const BASE = '/tasks/manager';

export const fetchManagerTasks = () => api.get(`${BASE}/tasks`);
export const getTaskById = (id) => api.get(`${BASE}/${id}`);
export const assignTask = (data) => api.post(`${BASE}/assign-task`, data);
export const updateTask = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteTask = (id) => api.delete(`${BASE}/${id}`);

export const fetchExtensionRequests = () => api.get(`${BASE}/extension-requests`);
export const approveExtension = (id) => api.put(`${BASE}/extension/approve/${id}`);
export const rejectExtension = (id, reason) =>
    api.put(`${BASE}/extension/reject/${id}`, reason, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });

export const fetchSubmittedTasks = () => api.get(`${BASE}/submittedTasks`);
export const approveTask = (id) => api.put(`${BASE}/task/approve/${id}`);
export const rejectTask = (id, reason) => api.put(`${BASE}/task/reject/${id}`, reason, { headers: { 'Content-Type': 'text/plain' } });