import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import MoviesList from '../components/MoviesList';

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * User playlists page
 */
function Playlists() {
    const { getUserPlaylists } = useApiServices();
  
    const {
      isPending,
      error,
      data: playlists,
    } = useQuery({
      queryKey: ['playlists'],
      queryFn: () => getUserPlaylists(),
    });
  
    if (isPending) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}>Loading...</div>;
    }
  
    if (error) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}>Error: {error.message}</div>;
    }
  
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Playlists page</h1>
  
        <MoviesList />
      </div>
    );
}

export default Playlists;
