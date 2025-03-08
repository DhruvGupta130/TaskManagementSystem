import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';
import { useCallback, useEffect, useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import {getUnreadNotifications} from '../services/api.js';

const Navbar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const fetchNotifications = useCallback(async () => {
        if (user && user?.role === 'USER') {
            const response = await getUnreadNotifications(user.id);
            setNotifications(response.data);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 60000);
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = () => {
        setShowDropdown(false);
        navigate('/notifications');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
            <div className="container mx-auto py-2 flex justify-between items-center w-full">
                {/* Logo Section */}
                <Link
                    to="/"
                    className="text-3xl font-extrabold tracking-wide hover:text-yellow-300 transition duration-300"
                >
                    TASK MANAGER
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Navigation Links */}
                <ul
                    className={`md:flex text-xl z-20 items-center absolute md:static bg-blue-500 md:bg-transparent w-full md:w-auto top-16 md:top-0 left-0 md:flex-row flex-col md:space-y-0 space-y-4 p-5 md:p-0 transition-all duration-300 ease-in-out ${isOpen ? 'flex' : 'hidden'} rounded-b-2xl md:rounded-none shadow-lg md:shadow-none`}
                >
                    <li>
                        <Link
                            to="/dashboard"
                            className="hover:text-yellow-300 transition duration-500 px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </Link>
                    </li>

                    {/* Role-Based Links */}
                    {user?.role === 'USER' && (
                    <li>
                        <Link
                            to="/tasks"
                            className="hover:text-yellow-300 transition duration-500 px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Tasks
                        </Link>
                    </li>
                    )}

                    {user?.role === 'ADMIN' && (
                        <li>
                            <Link
                                to="/admin"
                                className="hover:text-yellow-300 transition duration-500 px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin Panel
                            </Link>
                        </li>
                    )}

                    {user?.role === 'MANAGER' && (
                        <li>
                            <Link
                                to="/manager"
                                className="hover:text-yellow-300 transition duration-500 px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => setIsOpen(false)}
                            >
                                Manager Panel
                            </Link>
                        </li>
                    )}

                    {/* Notification Bell */}
                    {user?.role === "USER" && (<li className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="text-white hover:text-yellow-300 transition duration-300 p-2 rounded-full"
                        >
                            <Bell size={28} />
                            {notifications.filter((n) => !n.read).length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {notifications.filter((n) => !n.read).length}
                                </span>
                            )}
                        </button>

                        {showDropdown && (
                            <div className="absolute w-40 lg:w-60 lg:right-0 bg-white text-gray-900 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform origin-top-right z-20">
                                <ul className="max-h-48 overflow-y-auto divide-y divide-gray-200">
                                    {notifications.length === 0 ? (
                                        <li className="px-4 py-4 text-center text-lg text-gray-500">No new notification</li>
                                    ) : (
                                        notifications.map((notification) => (
                                            <li
                                                key={notification.id}
                                                className={`px-4 py-3 ${
                                                    notification.read ? 'bg-gray-100' : 'bg-blue-50'
                                                } hover:bg-gray-50 cursor-pointer transition duration-200`}
                                                onClick={() => handleNotificationClick(notification.id)}
                                            >
                                                <p className="text-sm font-medium">{notification.message}</p>
                                                <span className="text-xs text-gray-400">{notification.timestamp}</span>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                <div className="border-t border-gray-200 mt-2">
                                    <button
                                        onClick={() => handleNotificationClick()}
                                        className="w-full py-3 my-2 rounded-lg text-blue-600 hover:text-blue-700 hover:shadow cursor-pointer text-center text-sm transition-all duration-200 ease-in-out"
                                    >
                                        🔔 View All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>)}

                    {/* Login/Logout */}
                    {user ? (
                        <li>
                            <button
                                onClick={() => {
                                    navigate("/logout");
                                    setIsOpen(false);
                                }}
                                className="bg-red-500 px-5 mx-5 py-2 rounded-xl hover:bg-red-600 transition duration-300 shadow-md"
                            >
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link
                                to="/login"
                                className="hover:text-yellow-300 transition duration-500 px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
