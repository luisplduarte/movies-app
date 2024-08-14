/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

/**
 * Component that gives the app a global context with user's token and the save and clear
 * token methods
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userImage, setUserImage] = useState(localStorage.getItem('userImage'));

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const saveUser = (user) => {
    localStorage.setItem('userId', user.id);
    setUserId(user.id);
    localStorage.setItem('userImage', user.profileImage);
    setUserImage(user.profileImage);
  };

  const clearUser = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    localStorage.removeItem('userImage');
    setUserImage(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, userImage, saveToken, clearToken, saveUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;