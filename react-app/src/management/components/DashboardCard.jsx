import { Link } from 'react-router-dom';

const DashboardCard = ({ title, link }) => (
    <Link to={link} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h3 className="text-2xl font-semibold">{title}</h3>
    </Link>
);

export default DashboardCard;
