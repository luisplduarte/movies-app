/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from './api';

const AuthContext = createContext();

/**
 * Component that gives the app a global context with user's token and the save and clear
 * token methods
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const {
    isPending,
    error,
    data: userProfile,
  } = useQuery({
    enabled: !!token,
    queryKey: ['user'],
    queryFn: () =>
      api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (response) => {
      const userData = response.data;
      setUser(userData);
    },
  });

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const saveUser = (user) => {
    setUser(user);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, saveToken, clearToken, saveUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
