import {useEffect, useState} from 'react';
import { register } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/useAuth.jsx";

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'USER', name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const { user } = useAuth();

    useEffect(() => {
        if (error)
            setTimeout(() => setError(''), 3000);
    }, [error]);
    
    useEffect(() => {
        if(user) {
            navigate('/dashboard');
        }
    }, [navigate, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/login');
        } catch (error) {
            console.error(error);
            setError(error?.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg transform hover:scale-105 transition-transform duration-500">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">Create Your Account</h2>
                {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-md cursor-pointer"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-800 text-md sm:text-lg">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-500 hover:underline font-bold">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
