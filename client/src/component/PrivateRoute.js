import { useAuth } from '../util/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated)
    return isAuthenticated ? children : isAuthenticated !==null ? <Navigate to="/login" replace /> : null;
};

export default PrivateRoute;
