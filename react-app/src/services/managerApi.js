import axios from "axios";

const SERVICE_URL = "http://localhost:8080/api";
const MANAGER_SERVICE_URL = `${SERVICE_URL}/users/manager`;

export const getManagerTasks = async (managerId, token) => {
    try {
        const response = await axios.get(`${SERVICE_URL}/tasks/manager/${managerId}`, {
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
