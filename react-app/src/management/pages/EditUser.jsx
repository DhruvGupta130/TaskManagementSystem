import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/api.js";
import { useAuth } from "../../context/useAuth.jsx";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    const [user, setUser] = useState({ name: "", username: "", role: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id, authUser.token);
                setUser(response.data);
            } catch (error) {
                setError("Failed to fetch user data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, authUser.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await updateUser(id, user, authUser.token);
            setSuccess("User updated successfully!");
            setTimeout(() => navigate("/admin/users"), 1000);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update user.");
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-100 py-20 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Edit User</h2>

                {loading && <div className="text-center text-blue-500">Loading user data...</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

                {!loading && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
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
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                                required
                            />
                        </div>

                        {/* Role Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">User Role</label>
                            <select
                                name="role"
                                value={user.role}
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
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditUser;