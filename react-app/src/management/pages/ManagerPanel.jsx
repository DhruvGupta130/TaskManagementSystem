import { useState } from "react";
import ManagerDashboard from "../components/ManagerDashboard";
import TaskAssignment from "../components/TaskAssignment";

const ManagerPanel = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-10 flex flex-col items-center">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-10 tracking-wide text-center">
                👨‍💼 Manager Panel
            </h1>

            {/* Tab Navigation */}
            <div className="bg-white shadow-lg rounded-2xl flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mb-10 p-3 w-full max-w-md sm:max-w-lg">
                <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        activeTab === "dashboard"
                            ? "bg-blue-500 text-white scale-105 shadow-lg"
                            : "bg-gray-100 text-blue-500 hover:bg-blue-200 hover:scale-105"
                    }`}
                >
                    📊 Dashboard
                </button>
                <button
                    onClick={() => setActiveTab("assign")}
                    className={`w-full px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        activeTab === "assign"
                            ? "bg-blue-500 text-white scale-105 shadow-lg"
                            : "bg-gray-100 text-blue-500 hover:bg-blue-200 hover:scale-105"
                    }`}
                >
                    📝 Assign Task
                </button>
            </div>

            {/* Content */}
            <div className="w-full max-w-full sm:max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-500">
                {activeTab === "dashboard" && <ManagerDashboard />}
                {activeTab === "assign" && <TaskAssignment />}
            </div>
        </div>
    );
};

export default ManagerPanel;