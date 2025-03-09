import {useEffect, useState} from "react";
import { useAuth } from "../context/useAuth.jsx";
import {useNavigate} from "react-router-dom";
import {login} from "../services/api.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const {user, logged} = useAuth();

    useEffect(() => {
        if (error)
            setTimeout(() => setError(''), 3000);
    }, [error]);
    
    useEffect(() => {
        if(user) {
            navigate("/dashboard");
        }
    },[navigate, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const res = await login({username : email, password});
            logged(res.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            setError(error?.response?.data?.message || "Error when logging in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <form className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg transform hover:scale-105 transition-transform duration-500" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">Welcome Back</h2>
                {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-md cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
                <p className="text-center mt-6 text-gray-800 text-md sm:text-lg">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-indigo-500 hover:underline font-bold">
                        Create Now
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;