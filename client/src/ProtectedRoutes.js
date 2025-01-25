import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoutes = () => {
    const token = Cookies.get('jwt_token');
    const location = useLocation();

    if (token && location.pathname === '/login') {
        return <Navigate to="/" />;
    }

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
