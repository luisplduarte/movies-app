import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from "react-router-dom"
import { getProfile } from '../api'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfile(data)
        setLoading(false)
      } catch (err) {
        setError(err)
      } 
    };

    fetchProfile();
  }, [queryClient])

  const handleLogout = () => {
    localStorage.removeItem('token') // Remove JWT from local storage
    navigate('/login')
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error: {error.message}</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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