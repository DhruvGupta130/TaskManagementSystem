import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {Edit, Trash2, Search, PlusCircle, Loader2} from "lucide-react";
import { getAllUsers, deleteUser } from "../../services/api.js";
import { useAuth } from "../../context/useAuth.jsx";

const Users = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchUsers = useCallback(async () => {
        if (user && user.role === "ADMIN") {
            try {
                setLoading(true);
                const response = await getAllUsers(user?.token);
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                setError("Failed to fetch users. Please try again later.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const filtered = users.filter((u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    useEffect(() => {
        if (error)
            setTimeout(() => setError(''), 4000);
    }, [error]);

    useEffect(() => {
        if (success)
            setTimeout(() => setSuccess(''), 4000);
    }, [success]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                setDeleteLoading(id);
                await deleteUser(id, user?.token);
                setUsers(users.filter((u) => u.id !== id));
                setSuccess("User deleted successfully!");
            } catch (error) {
                setError(error.response?.data?.message || "Failed to delete user. Please try again.");
                console.error("Delete Error:", error);
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    return (
        <div className="bg-gray-100 px-4 md:px-10 py-20">
            <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-8">
                Manage Users
            </h1>

            {/* Alerts */}
            {error && (
                <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded-md mb-4 text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded-md mb-4 text-center">
                    {success}
                </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                {/* Search Bar */}
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                </div>

                {/* Add User Button */}
                <Link
                    to="/admin/users/create"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <PlusCircle size={20} />
                    <span>Add User</span>
                </Link>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-20 text-blue-500 text-xl">Loading users...</div>
                ) : filteredUsers.length > 0 ? (
                    <table className="w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Role</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-4">{u.name}</td>
                                <td className="py-3 px-4">{u.username}</td>
                                <td className="py-3 px-4">{u.role}</td>
                                <td className="py-3 px-4 flex justify-center space-x-4">
                                    <Link
                                        to={`/admin/users/edit/${u.id}`}
                                        className="text-green-500 hover:text-green-700 transition duration-200"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        disabled={deleteLoading === user.id}
                                        onClick={() => handleDelete(u.id)}
                                        className="text-red-500 hover:text-red-700 transition duration-200"
                                    >
                                        {deleteLoading === user.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-5 text-gray-500">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default Users;