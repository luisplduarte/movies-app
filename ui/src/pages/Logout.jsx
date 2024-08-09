import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

function Logout() {
  const { clearToken, clearUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    clearToken();
    clearUser();
    navigate('/login');
  }, []);

  // The logout page doesn't render anything so we just return null
  return null;
}

export default Logout;
