import axios from "axios";
import {VITE_API_GATEWAY_URL} from "./config.js";

const SERVICE_URL = `${VITE_API_GATEWAY_URL}/api`;
const MANAGER_SERVICE_URL = `${SERVICE_URL}/users/manager`;

export const getManagerTasks = async (token) => {
    try {
        const response = await axios.get(`${SERVICE_URL}/tasks/manager`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching manager tasks:", error);
        return [];
    }
};

export const assignTask = async (task, token) => {
    return await axios.post(`${SERVICE_URL}/tasks/assign-task`, task, {
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
};

export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${MANAGER_SERVICE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error assigning all users:", error);
    }
}
