import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Search, Loader2 } from "lucide-react";
import { getAllTasks, deleteTask } from "../../services/api.js";
import { useAuth } from "../../context/useAuth.jsx";
import {DateTime} from "../../services/DateTime.js";
import {handleFetchUser} from "../../services/helper.js";

const AllTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [userLoading, setUserLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        if (user && (user.role === "ADMIN" || user.role === "MANAGER")) {
            try {
                const response = await getAllTasks(user?.token);
                setTasks(response.data);
                setFilteredTasks(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch tasks.");
            }
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredTasks(tasks);
        } else {
            const filtered = tasks.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.priority.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTasks(filtered);
        }
    }, [searchQuery, tasks]);

    useEffect(() => {
        if (error) {
            setTimeout(() => setError(''), 4000);
        }
    }, [error])

    useEffect(() => {
        if (success) {
            setTimeout(() => setSuccess(""), 4000);
        }
    }, [success]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            setSuccess("");
            setError("");
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

    const closeUserModal = () => {
        setUserDetails(null);
    };

    return (
        <div className="bg-gray-100 px-4 md:px-10 py-20">
            <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-8">
                Manage Tasks
            </h1>

            {success && <div className="bg-green-100 text-center text-green-700 p-3 rounded-lg mb-4">{success}</div>}
            {error && <div className="bg-red-100 text-center text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search tasks by title, status, or priority..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            </div>

            {/* AllTasks Table */}
            <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">Due Date</th>
                        <th className="py-3 px-4 text-left">Title</th>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-left">Priority</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">User</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-4 text-gray-600">{DateTime(task.dueDate)}</td>
                                <td className="py-3 px-4">{task.title}</td>
                                <td className="py-3 px-4">{task.description}</td>
                                <td className={`py-3 px-4 ${task.priority === "HIGH" ? "text-red-500" : task.priority === "MEDIUM" ? "text-yellow-500" : "text-green-500"}`}>
                                    {task.priority}
                                </td>
                                <td className={`py-3 px-4 ${task.completed ? "text-green-500" : "text-blue-500"}`}>
                                    {task.completed ? "✔️ COMPLETED" : "🕛 IN PROGRESS"}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleFetchUser(task.id, user, setError, setUserLoading, setUserDetails)}
                                        className="text-blue-500 hover:text-blue-700 underline font-medium transition-colors duration-200 ease-in-out"
                                    >
                                        🔍 View User
                                    </button>
                                </td>
                                <td className="py-3 px-4 flex justify-center space-x-4">
                                    <Link
                                        to={`/admin/tasks/edit/${task.id}`}
                                        className="text-green-500 hover:text-green-700 transition duration-200"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className={`text-red-500 hover:text-red-700 transition duration-200 ${deleteLoading === task.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={deleteLoading === task.id}
                                    >
                                        {deleteLoading === task.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-5 text-gray-500">
                                No tasks found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* User Modal */}
            {userDetails && (
                <div className="fixed inset-0 bg-blend-darken backdrop-brightness-40 backdrop-blur-xs flex items-center justify-center top-[85px]">
                    <div className="bg-white bg-opacity-90 p-8 m-5 rounded-2xl shadow-2xl w-96 transition-transform transform hover:scale-105">
                        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">User Details</h2>
                        {userLoading && (
                            <div className="flex justify-center items-center">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                            </div>
                        )}

                        {!userLoading && (<div className="space-y-4">
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
                                    className={`px-3 py-1 text-white text-sm font-semibold ${userDetails.role === 'ADMIN' ? 'bg-red-500' : userDetails.role === 'MANAGER' ? 'bg-blue-500' : 'bg-green-500'}`}
                                >
                                    {userDetails.role}
                                </span>
                            </div>
                        </div>)}
                        <button
                            onClick={closeUserModal}
                            className="mt-8 w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTasks;