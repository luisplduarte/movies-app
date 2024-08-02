import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import useApiServices from '../api';
import { convertMinutesToHours } from '../utils';

/**
 * Page with movie's information
 */
function Movie() {
  const { id } = useParams();
  const { getMovie } = useApiServices();

  const {
    isPending,
    error,
    data: movie,
  } = useQuery({
    queryKey: ['movie'],
    queryFn: () => getMovie(id),
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
      <h1>{movie.title}</h1>

      <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} md={6} lg={4}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.name} poster`}
              style={{ width: '300px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <p style={{ marginBottom: '0' }}>Release date - {movie.release_date}</p>
          <p>Duration - {convertMinutesToHours(movie.runtime)}</p>
          <p>
            Genres -{' '}
            {movie.genres.reduce((acc, genre, index) => {
              return acc + (index > 0 ? ', ' : '') + genre.name;
            }, '')}
          </p>
          <p>Sinopse - {movie.overview}</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default Movie;
