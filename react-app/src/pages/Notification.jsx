import { useCallback, useEffect, useState } from 'react';
import { getAllNotifications, readNotifications } from "../services/api.js";
import { useAuth } from "../context/useAuth.jsx";
import { DateTime } from "../services/DateTime.js";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null); // New error state
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await getAllNotifications(user.id);
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setError("Something went wrong while fetching notifications. Please try again later.");
        }
    }, [user]);

    useEffect(() => {
        const markAsRead = async () => {
            try {
                await readNotifications(user.id);
                console.log('Notifications marked as read');
            } catch (error) {
                console.error("Failed to mark notifications as read:", error);
            }
        };

        const timeout = setTimeout(markAsRead, 1000);
        return () => clearTimeout(timeout);
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    if (error) {
        return (
            <div className="container mx-auto p-4 py-20 flex justify-center items-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-extrabold text-blue-600 text-center my-6">
                📢 All Notifications
            </h1>

            {notifications.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No notifications available.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`flex justify-between items-center p-4 border rounded-lg shadow-sm transition transform hover:scale-105 ${
                                notification.read ? 'bg-gray-100' : 'bg-blue-100'
                            }`}
                        >
                            <div>
                                <p className="text-lg font-medium text-gray-800">{notification.message}</p>
                                <span className="text-sm text-gray-500">
                                    🕒 {DateTime(notification.timestamp)}
                                </span>
                            </div>
                            <span
                                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                    notification.read ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}
                            >
                                {notification.read ? 'Read' : 'New'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;