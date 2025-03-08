import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../../services/api.js";
import { useAuth } from "../../context/useAuth.jsx";

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: "LOW",
        completed: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTaskById(id, user?.token);
                setTask(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch task details.");
            }
        };
        fetchTask();
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask({ ...task, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await updateTask(id, task, user?.token);
            setSuccess("Task updated successfully!");
            setTimeout(() => navigate("/admin/tasks"), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">Edit Task</h1>

                {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Priority</label>
                        <select
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            name="completed"
                            checked={task.completed}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-400"
                        />
                        <label className="ml-2 text-gray-700">Mark as Completed</label>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/tasks")}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Updating..." : "Update Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTask;
