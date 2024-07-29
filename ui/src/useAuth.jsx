import { useContext } from 'react';
import AuthContext from './AuthContext';

/**
 * Custom hook to give access to authentication context
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
