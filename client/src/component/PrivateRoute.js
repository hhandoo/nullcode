import { useAuth } from '../util/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    console.log(isAuthenticated)

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
