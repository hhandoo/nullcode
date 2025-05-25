import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, setAccessToken, removeAccessToken } from '../util/tokenUtils';
import api from '../services/api';

const { REACT_APP_GET_USER_PROFILE } = process.env;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api.setAuthCallback(setIsAuthenticated);

    const token = getAccessToken();
    if (token) {
      fetchUserProfile();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get(REACT_APP_GET_USER_PROFILE);
      setCurrentUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to fetch user profile:', err.response?.data || err.message);
      setCurrentUser(null);
      setIsAuthenticated(false);
      removeAccessToken();
    }
  };

  const login = async (token, rememberMe = true) => {
    setAccessToken(token, rememberMe);
    await fetchUserProfile();
  };

  const logout = () => {
    removeAccessToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        refreshUser: fetchUserProfile, // Exposed refresh function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
