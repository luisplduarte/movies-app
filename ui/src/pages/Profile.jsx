import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from "react-router-dom"
import useApiServices from '../api';
import useAuth from '../useAuth';

/**
 * Profile page with user's information
 */
function Profile() {
  const { clearToken } = useAuth();
  const { getProfile } = useApiServices();
  const navigate = useNavigate();

  const { isPending, error, data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  };

  if (isPending) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error: {error.message}</div>
  }

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <h1>Your profile page</h1>
      <p>User name - {profile.username}</p>
      <p>User id - {profile.id}</p>
      <Link to="/">Go to home page</Link>
      <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#6200ee', color: 'white', border: 'none', borderRadius: '4px', marginTop: '20px' }}>
        Logout
      </button>
    </div>
  )
}

export default Profile;