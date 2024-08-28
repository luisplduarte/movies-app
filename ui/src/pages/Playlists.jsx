import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useApiServices from '../api';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Card from '../components/Card';

/**
 * User playlists page
 */
function Playlists() {
  const { getUserPlaylists } = useApiServices();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: playlists,
  } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => getUserPlaylists(),
  });

  const handleAddButton = () => {
    navigate('/playlists/new');
  };

  /**
   * Here I'm navigating to different page if it's the favorites playlist,
   * because the favorites one is special and it's not stored in the API.
   */
  const handleViewMovies = (playlist) => {
    if (!playlist.createdAt) navigate('/playlists/favorites');
    else navigate(`/playlists/${playlist._id}`);
  };

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Error loading playlists...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <h1>Your playlists</h1>
      <AddIcon
        onClick={handleAddButton}
        fontSize="large"
        style={{
          marginBottom: '16px',
          cursor: 'pointer',
        }}
      />
      {playlists?.length ? (
        <Grid container spacing={2} justifyContent="center" alignItems="stretch" sx={{ padding: '0 32px' }}>
          {playlists?.map((playlist, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card
                key={index}
                title={playlist.name}
                description={playlist.description}
                onButtonPressed={() => handleViewMovies(playlist)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <h2>{`You don't have any playlists yet`}</h2>
      )}
    </div>
  );
}

export default Playlists;
