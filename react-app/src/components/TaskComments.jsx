import {useState, useEffect, useCallback} from 'react';
import { getComment, getUserById, sendComment } from '../services/api.js';
import { useAuth } from "../context/useAuth.jsx";
import {FaPaperPlane, FaSpinner, FaTimes} from 'react-icons/fa';

const TaskComments = ({ taskId, closeModal }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState({
        taskId: taskId,
        userId: user.id,
        content: ''
    });

    const fetchCommentsWithUsernames = useCallback(async () => {
        setLoading(true);
        try {
            const { data: commentsData } = await getComment(taskId, user.token);

            const commentsWithUsernames = await Promise.all(commentsData.map(async (comment) => {
                try {
                    const { data: userData } = await getUserById(comment.userId, user.token);
                    return { ...comment, userName: userData.name };
                } catch (err) {
                    console.error(`Failed to fetch user for comment ${comment.id}`, err);
                    return { ...comment, userName: 'Unknown User' };
                }
            }));

            setComments(commentsWithUsernames);
        } catch (err) {
            console.error('Failed to fetch comments', err);
            setError("Failed to fetch comments");   
        } finally {
            setLoading(false);
        }
    },[taskId, user.token]);

    useEffect(() => {
        fetchCommentsWithUsernames();
    }, [fetchCommentsWithUsernames, taskId, user.token]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.content.trim()) return;

        try {
            await sendComment(newComment, user.token);
            setNewComment({ ...newComment, content: '' });
            fetchCommentsWithUsernames();
        } catch (err) {
            console.error('Failed to add comment', err);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-brightness-40 backdrop-blur-xs bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-10 transform transition-all scale-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-800">Task Comments</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-red-500 transition duration-200"
                    >
                        <FaTimes size={28} />
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500 py-4">
                        <p>⚠️ {error}</p>
                    </div>
                )}

                {!error && !loading && (<div className="mb-8">
                    {/* Comments Section */}
                    <div className="space-y-6 max-h-80 overflow-y-auto bg-gray-100 p-6 rounded-xl">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                                >
                                    <p className="text-lg text-gray-800">{comment.content}</p>
                                    <span className="text-sm text-gray-500 mt-2 block">
                                    — {comment.userName || 'Anonymous'}
                                </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 italic">No comments yet. Be the first!</p>
                        )}
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleAddComment} className="mt-8">
                        <div className="relative">
                        <textarea
                            value={newComment.content}
                            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                            rows="4"
                            placeholder="Type your comment here..."
                            className="w-full p-5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-lg"
                        />
                            <button
                                type="submit"
                                className="absolute bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
                            >
                                <FaPaperPlane size={18} />
                            </button>
                        </div>
                    </form>
                </div>)}
            </div>
        </div>
    );
};

export default TaskComments;