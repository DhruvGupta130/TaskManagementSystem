import { useEffect, useState } from "react";
import { getManagerTasks } from "../../services/managerApi.js";
import { useAuth } from "../../context/useAuth.jsx";
import { DateTime } from "../../services/DateTime.js";
import { handleFetchUser } from "../../services/helper.js";
import TaskComments from "../../components/TaskComments.jsx";
import {Loader2} from "lucide-react";
import {deleteTask} from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import {FaSpinner} from "react-icons/fa";

const ManagerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const data = await getManagerTasks(user?.token);
                setTasks(data);
            } catch (e) {
                console.error("Failed to fetch tasks:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [user]);

    useEffect(() => {
        if (success) {
            setTimeout(() => setSuccess(""), 4000);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            setTimeout(() => setError(''), 4000);
        }
    }, [error])

    const closeUserModal = () => {
        setUserDetails(null);
    };

    const openCommentsModal = (taskId) => {
        setSelectedTaskId(taskId);
        setShowComments(true);
    };

    const closeCommentsModal = () => {
        setSelectedTaskId(null);
        setShowComments(false);
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete the task?")) return;

        try {
            setError("");
            setSuccess("");
            setDeleteLoading(id);

            await deleteTask(id, user?.token);
            setTasks(tasks.filter((task) => task.id !== id));
            setSuccess("Task deleted successfully!");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete task. Please try again.");
            console.error("Delete Error:", error);
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
                📊 Manager Dashboard
            </h2>

            {success && <div className="bg-green-100 text-center text-green-700 p-3 rounded-lg mb-4">{success}</div>}
            {error && <div className="bg-red-100 text-center text-red-700 p-3 rounded-lg mb-4">{error}</div>}
            {loading ?  <div className="flex justify-center items-center py-4">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
                : (<div>
                {tasks.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No tasks available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="overflow-x-auto rounded-2xl shadow-lg">
                            <table className="min-w-full bg-white rounded-2xl overflow-hidden">
                                <thead className="bg-blue-100 text-blue-800 sticky top-0">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Task Title
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Description</th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Priority</th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Status</th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Due Date</th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">User</th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Actions</th>
                                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">Comments</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-t hover:bg-blue-50 transition-colors even:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 text-sm sm:text-base font-medium">{task.title}</td>
                                            <td className="py-3 px-4 text-sm sm:text-base truncate max-w-xs sm:max-w-sm">{task.description}</td>
                                            <td
                                                className={`py-3 px-4 text-sm sm:text-base font-medium ${
                                                    task.priority === "HIGH"
                                                        ? "text-red-600"
                                                        : task.priority === "MEDIUM"
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                }`}
                                            >
                                                {task.priority}
                                            </td>
                                            <td>
                                                <span
                                                    className={`inline-block py-1 px-3 text-xs sm:text-sm font-semibold rounded-full ${
                                                        task.completed
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                                >
                                                    {task.completed ? "Completed" : "In Progress"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm sm:text-base text-gray-500">
                                                {DateTime(task.dueDate)}
                                            </td>
                                            <td className="py-3 px-4 text-sm sm:text-base text-gray-700 text-center">
                                                <button
                                                    onClick={() => handleFetchUser(task.id, user, setError, setUserLoading, setUserDetails)}
                                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                >
                                                    👀 View
                                                </button>
                                            </td>
                                            <td className="flex justify-between py-3 px-4 text-sm sm:text-base text-gray-700 text-center">
                                                <button
                                                    onClick={() => navigate((`/manager/tasks/edit/${task.id}`))}
                                                    className="bg-orange-400 text-white py-2 m-0.5 px-4 rounded-lg font-medium hover:bg-orange-600 transition-transform transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                >
                                                    📝 Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    disabled={deleteLoading === task.id}
                                                    className="bg-red-600 text-white py-2 m-0.5 px-4 rounded-lg font-medium hover:bg-red-800 transition-transform transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                >
                                                    {deleteLoading === task.id ?
                                                        <Loader2 className="animate-spin" size={20}/> : "🗑️ Delete"}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-sm sm:text-base hover:scale-105 text-gray-700 text-center">
                                                <button
                                                    onClick={() => openCommentsModal(task.id)}
                                                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 w-full sm:w-auto rounded-lg font-medium transition duration-200"
                                                >
                                                    💬 Manage Comments
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {userDetails && (
                    <div
                        className="fixed inset-0 bg-blend-darken backdrop-brightness-40 backdrop-blur-xs flex items-center justify-center top-[85px]">
                        <div
                            className="bg-white p-8 m-5 rounded-2xl shadow-2xl w-96 transition-transform transform scale-95 hover:scale-100 duration-200">
                            <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">User Details</h2>
                            {userLoading ? (
                                <div className="flex justify-center items-center">
                                    <div
                                        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600 font-medium">Name:</span>
                                        <span className="text-gray-900 font-semibold">{userDetails.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600 font-medium">Email:</span>
                                        <span className="text-gray-900 font-semibold">{userDetails.username}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600 font-medium">Role:</span>
                                        <span
                                            className={`px-3 py-1 text-white text-sm font-semibold ${
                                                userDetails.role === 'ADMIN'
                                                    ? 'bg-red-500'
                                                    : userDetails.role === 'MANAGER'
                                                        ? 'bg-blue-500'
                                                        : 'bg-green-500'
                                            }`}
                                        >
                                        {userDetails.role}
                                    </span>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={closeUserModal}
                                className="mt-8 w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>)}
            </div>)}

            {showComments && <TaskComments taskId={selectedTaskId} closeModal={closeCommentsModal} />}
        </div>
    );
};

export default ManagerDashboard;