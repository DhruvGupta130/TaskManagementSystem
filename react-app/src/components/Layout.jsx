import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const Layout = () => (
    <div>
        <Navbar />
        <main className="container mx-auto p-4">
            <Outlet />
        </main>
    </div>
);

export default Layout;
