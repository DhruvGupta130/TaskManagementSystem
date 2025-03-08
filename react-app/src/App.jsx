import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Logout from "./components/Logout.jsx";
import Notification from "./pages/Notification.jsx";
import AdminPanel from "./management/pages/AdminPanel.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import Users from "./management/pages/Users.jsx";
import AllTasks from "./management/pages/AllTasks.jsx";
import EditTask from "./management/pages/EditTask.jsx";
import EditUser from "./management/pages/EditUser.jsx";
import CreateUser from "./management/pages/CreateUser.jsx";
import AdminSettings from "./management/pages/AdminSettings.jsx";

const App = () => (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute role={["USER", "ADMIN"]} >
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                    <ProtectedRoute role={["USER"]}>
                        <Tasks />
                    </ProtectedRoute>
                } />

                <Route path="/notifications" element={
                    <ProtectedRoute role={["USER"]}>
                        <Notification/>
                    </ProtectedRoute>
                } />

                <Route path="/admin" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <AdminPanel />
                    </ProtectedRoute>
                } />

                <Route path="/admin/users" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <Users />
                    </ProtectedRoute>
                } />

                <Route path="/admin/users/create" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <CreateUser />
                    </ProtectedRoute>
                } />

                <Route path="/admin/users/edit/:id" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <EditUser />
                    </ProtectedRoute>
                } />

                <Route path="/admin/tasks" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <AllTasks />
                    </ProtectedRoute>
                } />

                <Route path="/admin/tasks/edit/:id" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <EditTask />
                    </ProtectedRoute>
                } />

                <Route path="/admin/settings" element={
                    <ProtectedRoute role={["ADMIN"]}>
                        <AdminSettings />
                    </ProtectedRoute>
                } />

                <Route path="/not-authorized" element={<NotAuthorized />} />

            </Route>
        </Routes>
    </AuthProvider>
);

export default App;
