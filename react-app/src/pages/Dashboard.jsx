import { useAuth } from "../context/useAuth.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-center py-30 px-4 bg-gradient-to-br from-blue-100 to-indigo-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-3xl transform hover:scale-105 transition-transform duration-500" style={{ maxHeight: '80vh', overflow: 'auto' }}>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-900 mb-4 sm:mb-6">Welcome, {user?.name}!</h1>
                <p className="text-base sm:text-lg text-center text-gray-700 mb-6 sm:mb-8">Manage your tasks efficiently and stay organized with ease.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center text-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {user.role === "USER" && (
                        <Link to="/tasks"
                              className="min-w-50 text-center px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-lg"
                        >
                            📝 Manage Tasks
                        </Link>
                    )}
                    {user.role === "MANAGER" && (
                        <Link to="/manager"
                              className="min-w-50 text-center px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-lg"
                        >
                            ⚙️ Manger Controls
                        </Link>
                    )}
                        {user.role === "ADMIN" && (
                            <Link
                                to="/admin"
                                className="min-w-50 text-center px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-lg"
                            >
                                ⚙️ Admin Controls
                            </Link>
                        )}
                        <Link
                            to= "/logout"
                            className="min-w-50 text-center px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition duration-300 shadow-lg"
                        >
                            🚪 Logout
                        </Link>
                    </div>
                </div>
            </div>
    );
};

export default Dashboard;