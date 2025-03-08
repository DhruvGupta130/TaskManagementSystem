import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/api.js";
import { useAuth } from "../../context/useAuth.jsx";

const CreateUser = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        name: "",
        username: "",
        role: "USER",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await createUser(newUser, authUser?.token);
            setSuccess("User created successfully!");
            setTimeout(() => navigate("/admin/users"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create user. Please try again.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create New User</h1>

            {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        name="username"
                        value={newUser.username}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="Set a password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                    />
                </div>

                {/* Role Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">User Role</label>
                    <select
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 bg-white"
                        required
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/users")}
                        className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition duration-200"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;