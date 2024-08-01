import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../AuthContext'

/**
 * Every route inside this PrivateRoute is only accessible to logged in users.
 * @returns 
 */
function PrivateRoutes() {
  const { token } = useContext(AuthContext);

  return (
    token ? <Outlet /> : <Navigate to="/login" />
  );
}

export default PrivateRoutes;