import DashboardCard from "../components/DashboardCard.jsx";

const AdminPanel = () => {
    return (
        <div className="py-20 bg-gray-50 flex">
            <div className="flex-1 px-6 md:px-10">
                <h1 className="text-3xl md:text-4xl flex justify-center font-extrabold text-blue-600 text-center md:text-left">
                    Admin Panel
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    <DashboardCard title="👥 Manage Users" link="/admin/users" />
                    <DashboardCard title="📝 Manage Tasks" link="/admin/tasks" />
                    <DashboardCard title="⚙️ Settings" link="/admin/settings" />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
