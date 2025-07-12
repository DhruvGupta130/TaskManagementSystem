import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from './routes/PrivateRoute';
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import Unauthorized from "./pages/Unauthorized";
import EditTask from './pages/manager/EditTask';
import SubmittedTasks from './pages/manager/SubmittedTasks';
import ExtensionRequests from './pages/manager/ExtensionRequests';
import { injectInterceptors } from "./api/api";
import { refreshToken } from "./utils/refreshToken";
import { login, logout } from "./store/slices/AuthSlice";
import ManageWorkersAndTasks from "./pages/manager/ManageWorkersAndTasks.jsx";
import MyTasks from "./pages/manager/MyTask.jsx";
import ManageProfile from "./pages/ManageProfile.jsx";
import WorkerDashboard from "./pages/worker/WorkerDashboard.jsx";
import MyWorkerTasks from "./pages/worker/MyWorkerTasks.jsx";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AllTasks from './pages/admin/AllTasks.jsx';
import UserList from './pages/admin/UserList.jsx';

dayjs.extend(relativeTime);

function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getToken = () => token;
        injectInterceptors(
            (accessToken, role) => dispatch(login({ token: accessToken, role })),
            () => dispatch(logout()),
            getToken
        );
        const refresh = async () => {
            const { accessToken, role } = await refreshToken();
            dispatch(login({ token: accessToken, role }));
        }
        refresh().then();
    }, [dispatch, token]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Manager Routes */}
                <Route
                    path="/manager/dashboard"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER']}>
                            <ManagerDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manager/assign"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER']}>
                            <ManageWorkersAndTasks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manager/tasks"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER']}>
                            <MyTasks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manager/edit/:taskId"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER']}>
                            <EditTask />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manager/submitted-tasks"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER']}>
                            <SubmittedTasks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manager/extension-requests"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER']}>
                            <ExtensionRequests />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute allowedRoles={['MANAGER', "WORKER", "ADMIN"]}>
                            <ManageProfile />
                        </PrivateRoute>
                    }
                />
                {/* Worker Routes */}
                <Route
                    path="/worker/dashboard"
                    element={
                        <PrivateRoute allowedRoles={['WORKER']}>
                            <WorkerDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/worker/tasks"
                    element={
                        <PrivateRoute allowedRoles={['WORKER']}>
                            <MyWorkerTasks />
                        </PrivateRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/tasks"
                    element={
                        <PrivateRoute allowedRoles={['ADMIN']}>
                            <AllTasks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <PrivateRoute allowedRoles={['ADMIN']}>
                            <UserList />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
