import {useCallback, useEffect, useState} from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api.js';
import { useAuth } from "../context/useAuth.jsx";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'LOW',
        dueDate: '',
        overdue: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false); // state to toggle form visibility

    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getTasks(user?.id, user?.token);
            setTasks(data);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (error) {
            setTimeout(() => setError(''), 5000);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            setTimeout(() => setSuccess(''), 5000);
        }
    }, [success]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        const selectedDate = new Date(newTask.dueDate);
        const currentDate = new Date();
        if (selectedDate <= currentDate) {
            setError('Due date must be in the future');
            setLoading(false);
            return;
        }
        try {
            await createTask(newTask, user.token);
            setNewTask({ title: '', description: '', priority: 'LOW', dueDate: '', overdue: ''});
            setSuccess('Task created successfully!');
            setIsFormOpen(false);
            fetchTasks();
        } catch (err) {
            setError('Failed to create task');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (taskId, updatedTask) => {
        setLoading(true);
        try {
            await updateTask(taskId, updatedTask);
            setSuccess('Task updated successfully!');
            fetchTasks();
        } catch (err) {
            setError('Failed to update task');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        setLoading(true);
        try {
            await deleteTask(taskId);
            setSuccess('Task deleted successfully!');
            fetchTasks();
        } catch (err) {
            setError('Failed to delete task');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Task Management</h2>
            {error && <p className="text-red-500 text-center mb-4 text-xl">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4 text-xl">{success}</p>}

            {/* Button to open the form */}
            <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 mb-6 transition duration-200 sm:text-center w-full lg:w-auto"
            >
                {isFormOpen ? 'Close Form' : 'Create New Task'}
            </button>

            {/* Task Creation Form */}
            {isFormOpen && (
                <form onSubmit={handleCreateTask} className="mb-8 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    <input
                        type="datetime-local"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-full p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                </form>
            )}

            {/* Task List */}
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <div className="loader"></div>
                </div>
            ) : (
                !isFormOpen && <ul className="space-y-6">
                    {tasks.map((task) => (
                        <li key={task.id} className="bg-white p-4 sm:p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                {/* Task Details */}
                                <div className="w-full sm:w-3/4 space-y-3">
                                    <h3 className={`text-2xl font-bold ${task.overdue ? 'text-red-700' : 'text-gray-900'}`}>
                                        <span className="text-red-500">{task.overdue ? "OVERDUE: " : ""}</span>{task.title.toUpperCase()}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-sm sm:text-md">
                                        <span className="text-gray-600">🗓 Due: {new Date(task.dueDate).toLocaleString()}</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${task.priority === 'LOW' ? 'bg-green-500' : task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        >
                                          {task.priority}
                                        </span>

                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${task.completed ? 'bg-blue-500' : 'bg-orange-500'}`}
                                        >
                                          {task.completed ? '✔ Completed' : '⌛ Pending'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-md">{task.description}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex sm:flex-col gap-2 sm:gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleUpdateTask(task.id, { ...task, completed: !task.completed })}
                                        className={`px-4 py-2 w-full sm:w-auto rounded-lg font-medium text-white transition duration-200 ${
                                            task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    >
                                        {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 w-full sm:w-auto rounded-lg font-medium transition duration-200"
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Tasks;
