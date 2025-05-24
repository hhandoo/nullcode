import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, setAccessToken, removeAccessToken } from '../util/tokenUtils';
import api from '../services/api';

const { REACT_APP_GET_USER_PROFILE } = process.env;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details if authenticated
  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (token) {
        setIsAuthenticated(true);
        try {
          const res = await api.post(REACT_APP_GET_USER_PROFILE);
          setCurrentUser(res.data);
        } catch (err) {
          console.error('Failed to fetch user profile:', err.response?.data || err.message);
          // On error, consider logout or clearing auth state
          setCurrentUser(null);
          setIsAuthenticated(false);
          removeAccessToken();
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (token, rememberMe = true) => {
    setAccessToken(token, rememberMe);
    setIsAuthenticated(true);
    setLoading(true);
    try {
      const res = await api.get(REACT_APP_GET_USER_PROFILE);
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile after login:', err.response?.data || err.message);
      setCurrentUser(null);
      setIsAuthenticated(false);
      removeAccessToken();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAccessToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
