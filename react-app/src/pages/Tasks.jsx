import { useCallback, useEffect, useState } from 'react';
import { getTasks, requestTaskExtension, updateTaskStatus } from '../services/api.js';
import { useAuth } from '../context/useAuth.jsx';
import { DateTime } from '../services/DateTime.js';
import TaskComments from '../components/TaskComments.jsx';
import {FaSpinner} from "react-icons/fa";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
    const [requestedDueDate, setRequestedDueDate] = useState('');
    const [reason, setReason] = useState('');

    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getTasks(user?.token);
            setTasks(data);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (error) setTimeout(() => setError(''), 6000);
    }, [error]);

    useEffect(() => {
        if (success) setTimeout(() => setSuccess(''), 6000);
    }, [success]);

    const handleUpdateTask = async (taskId, updatedTask) => {
        setLoading(true);
        try {
            await updateTaskStatus(taskId, updatedTask, user.token);
            setSuccess('Task updated successfully!');
            fetchTasks();
        } catch (err) {
            setError('Failed to update task');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCommentsModal = (taskId) => {
        setSelectedTaskId(taskId);
        setShowComments(true);
    };

    const closeCommentsModal = () => {
        setSelectedTaskId(null);
        setShowComments(false);
    };

    const requestExtension = (task) => {
        if(task.extension) {
            setError("Extension request is already submitted.");
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        setSelectedTaskId(task.id);
        setRequestedDueDate('');
        setReason('');
        setIsExtensionModalOpen(true);
    };

    const handleRequestExtension = async (e) => {
        e.preventDefault();
        if (!requestedDueDate) {
            setError('Please select a new due date');
            return;
        }

        const extensionData = { requestedDueDate, reason };

        try {
            await requestTaskExtension(selectedTaskId, extensionData, user.token);
            setSuccess('Extension request submitted successfully');
            setIsExtensionModalOpen(false);
            fetchTasks();
        } catch (err) {
            setError('Failed to submit extension request');
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Task Management</h2>
            {error && <p className="text-red-500 text-center mb-4 text-xl">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4 text-xl">{success}</p>}

            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                </div>
            ) : (
                <ul className="space-y-6">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`bg-white p-4 sm:p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                                task.overdue && !task.completed ? 'border-red-500' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div className="w-full sm:w-3/4 space-y-4">
                                    <h3
                                        className={`text-2xl font-extrabold flex items-center gap-2 ${
                                            task.overdue && !task.completed ? 'text-red-700' : 'text-gray-900'
                                        }`}
                                    >
                                        {task.overdue && !task.completed && (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm animate-pulse">
                                                OVERDUE
                                            </span>
                                        )}
                                        {task.title.toUpperCase()}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-3 text-sm sm:text-md">
                                        <span className="text-gray-600">🗓 Due: {DateTime(task.dueDate)}</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${
                                                task.priority === 'LOW'
                                                    ? 'bg-green-500'
                                                    : task.priority === 'MEDIUM'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                            }`}
                                        >
                                            {task.priority}
                                        </span>

                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${
                                                task.completed
                                                    ? 'bg-blue-500'
                                                    : task.overdue
                                                        ? 'bg-red-600'
                                                        : 'bg-orange-500'
                                            }`}
                                        >
                                            {task.completed ? '✔ Completed' : task.overdue ? '⏳ Overdue' : '⌛ In Progress'}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 text-md leading-relaxed">{task.description}</p>
                                </div>

                                <div className="flex sm:flex-col gap-2 sm:gap-4 w-full sm:w-auto">
                                    {!task.completed && task.overdue && (
                                        <button
                                            onClick={() => requestExtension(task)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-full sm:w-auto rounded-lg font-medium transition duration-200"
                                        >
                                            📝 Request Extension
                                        </button>
                                    )}

                                    {!task.overdue && (
                                        <button
                                            onClick={() => handleUpdateTask(task.id, { ...task, completed: !task.completed })}
                                            className={`px-4 py-2 w-full sm:w-auto rounded-lg font-medium text-white transition duration-200 ${
                                                task.completed
                                                    ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
                                                    : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                            disabled={task.completed}
                                        >
                                            {task.completed ? '✅ Completed' : 'Mark as Completed'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => openCommentsModal(task.id)}
                                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 w-full sm:w-auto rounded-lg font-medium transition duration-200"
                                    >
                                        💬 Manage Comments
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isExtensionModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-40 backdrop-blur-xs bg-opacity-60 flex justify-center items-center z-50"
                    onClick={() => setIsExtensionModalOpen(false)} // Close modal on outside click
                >
                    <div
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="extension-modal-title"
                        tabIndex="-1"
                    >
                        <h2 id="extension-modal-title" className="text-2xl font-bold mb-4 text-center">
                            📝 Request Deadline Extension
                        </h2>
                        <form onSubmit={handleRequestExtension}>
                            <div className="mb-4">
                                <label htmlFor="due-date" className="block text-gray-700 font-medium mb-2">
                                    New Due Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="due-date"
                                    type="datetime-local"
                                    value={requestedDueDate}
                                    onChange={(e) => setRequestedDueDate(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="extension-reason" className="block text-gray-700 font-medium mb-2">
                                    Reason (Optional)
                                </label>
                                <textarea
                                    id="extension-reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows="3"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                    placeholder="Explain why you need an extension..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsExtensionModalOpen(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ${!requestedDueDate && 'opacity-50 cursor-not-allowed'}`}
                                    disabled={!requestedDueDate}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showComments && <TaskComments taskId={selectedTaskId} closeModal={closeCommentsModal} />}
        </div>
    );
};

export default Tasks;