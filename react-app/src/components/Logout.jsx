import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/useAuth.jsx';

const Logout = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = useAuth();

    useEffect(() => {
        logout();
        setTimeout(() => {
            setIsLoading(false);
            navigate("/login");
        }, 1000);
    }, [logout, navigate]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-white w-full"> {/* Adjust height to avoid covering navbar */}
            {isLoading ? (
                <div className="text-center">
                    <div className="text-center animate-spin rounded-full h-16 border-t-4 w-16 border-blue-500"></div>
                    <p className="text-center mt-4 text-lg font-semibold text-gray-700">Logging out...</p>
                </div>
            ) : null}
        </div>
    );
};

export default Logout;
