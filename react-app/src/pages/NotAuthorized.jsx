import { Link } from 'react-router-dom';

const NotAuthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center py-30 bg-gray-100 text-gray-900">
            <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
            <h2 className="text-3xl font-semibold mb-2">Access Denied</h2>
            <p className="text-lg mb-6 mx-6 text-center">Oops! You don’t have permission to view this page.</p>
            <Link
                to="/"
                className="px-6 py-3 text-center bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
                Go Back to Home
            </Link>
        </div>
    );
};

export default NotAuthorized;