import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useApiServices from '../api';
import UserReviews from '../components/UserReviews';

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Profile page with user's information
 */
function Profile() {
  const { getProfile } = useApiServices();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: profile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Your profile page</h1>
      {error ? (
        <p>Error loading profile...</p> // Show error message
      ) : isPending ? (
        <CircularProgress /> // Show pending component
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="flex-center"
          textAlign="center"
        >
          <Grid item xs={12} md={6} lg={6}>
            <h2 style={{ marginBottom: '0px' }}>User id</h2>
            <p style={{ marginTop: '0px' }}>{profile.id}</p>
            <h2 style={{ marginBottom: '0px' }}>Username</h2>
            <p style={{ marginTop: '0px' }}>{profile.username}</p>
            <h2 style={{ marginBottom: '0px' }}>Bio</h2>
            <p style={{ marginTop: '0px' }}>{profile.bio}</p>

            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '64px' }}
            >
              <button
                onClick={() => navigate('/profile/edit')}
                style={{
                  padding: '10px',
                  backgroundColor: '#6200ee',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '20px',
                }}
              >
                Edit profile
              </button>

              <button
                onClick={() => navigate('/logout')}
                style={{
                  padding: '10px',
                  backgroundColor: '#ea0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '20px',
                }}
              >
                Logout
              </button>
            </div>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <img
                //The timestamp here is used to invalidate browser caching for the image
                src={`${API_URL}/uploads/${profile.profileImage}?timestamp=${new Date().getTime()}`}
                alt={`${profile.username} profile image`}
                style={{
                  width: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <h2 style={{ marginBottom: '0px' }}>User reviews</h2>
            <UserReviews />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Profile;
