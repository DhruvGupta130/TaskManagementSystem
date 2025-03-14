import { useState, useEffect } from "react";
import { assignTask, getAllUsers } from "../../services/managerApi.js";
import { useAuth } from "../../context/useAuth.jsx";
import {FaSpinner} from "react-icons/fa";

const TaskAssignment = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState(""); // <-- New state for due date
    const [assignees, setAssignees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getAllUsers(user.token);
                setAssignees(response);
            } catch (e) {
                setError(e.response?.data?.message || "Failed to fetch users");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.token]);

    useEffect(() => {
        if (error) {
            setTimeout(() => setError(''), 3000);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            setTimeout(() => setSuccess(''), 3000);
        }
    }, [success]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!assigneeId) {
            setError("Please select a user to assign the task");
            return;
        }

        const oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

        if (new Date(dueDate) < oneHourFromNow) {
            setError("Due date must be at least 1 hour in the future");
            return;
        }

        const task = {
            managerId: user.id,
            assigneeId,
            priority,
            title,
            description,
            dueDate,
        };
        setAssignLoading(true);
        try {
            await assignTask(task, user.token);
            setSuccess("Task assigned successfully!");
            setTitle("");
            setDescription("");
            setAssigneeId("");
            setPriority("");
            setDueDate("");
        } catch (e) {
            setError(e.response?.data?.message || "Failed to assign tasks");
            console.error(e);
        } finally {
            setAssignLoading(false);
        }
    };

    return (
        <div className="mx-auto bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 rounded-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-8 sm:mb-10 text-center tracking-wide">
                📝 Assign a New Task
            </h2>

            {error && (
                <div className="mb-6 flex items-center justify-center bg-red-100 text-red-600 border border-red-300 p-4 rounded-lg">
                    ❌ {error}
                </div>
            )}

            {success && (
                <div className="mb-6 flex items-center justify-center bg-green-100 text-green-600 border border-green-300 p-4 rounded-lg">
                    ✔️ {success}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Task Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all hover:shadow-sm"
                                placeholder="Enter task title"
                                required
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all hover:shadow-sm"
                                required
                            >
                                <option value="" disabled>Select priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        {/* Assign To */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all hover:shadow-sm"
                                required
                            >
                                <option value="" disabled>Select a user</option>
                                {assignees?.map((user) => (
                                    <option key={user.id} value={user.id} className="text-sm">
                                        {user.name} ({user.username})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date & Time</label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all hover:shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Task Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all hover:shadow-sm"
                            placeholder="Enter task description"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={assignLoading}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-100"
                    >
                        {assignLoading? "Assigning..." : "🚀 Assign Task"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default TaskAssignment;