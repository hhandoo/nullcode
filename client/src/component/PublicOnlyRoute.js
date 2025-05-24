import { useAuth } from '../util/AuthContext';
import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/profile" replace /> : children;
};

export default PublicOnlyRoute;
