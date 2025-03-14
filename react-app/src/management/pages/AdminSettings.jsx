import { useState } from "react";
import { useAuth } from "../../context/useAuth.jsx";
import { updatePassword } from "../../services/api.js";
import {useNavigate} from "react-router-dom";

const AdminSettings = () => {
    const { user} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.username,
        password: "",
        newPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleChangePassword = async () => {
        try {
            setLoading(true);
            if (formData.newPassword !== formData.password) {
                setError("New passwords do not match!");
                return;
            }

            if (!formData.password) {
                setError("Please enter your current password!");
                return;
            }

            if (formData.newPassword.length < 6) {
                setError("New password must be at least 6 characters!");
                return;
            }
            const response = await updatePassword(formData.password, user.token);
            setSuccess("Password updated successfully!");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 text-center mb-8">⚙️ Admin Settings</h1>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 border border-green-400 p-3 rounded-md mb-4 text-center">
                        {success}
                    </div>
                )}

                {/* Security Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">🔒 Security</h2>
                    <div className="space-y-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Current Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                        <button
                            onClick={handleChangePassword}
                            className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="text-center">
                    <button
                        onClick={() => navigate("/logout")}
                        className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
