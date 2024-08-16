import React, { useState } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import CustomSnackbar from '../components/CustomSnackbar';

/**
 * Page with movies
 */
function PlaylistFavorites() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getFavoritesPlaylist, getMovie } = useApiServices();
  //TODO: use a custom hook to show the snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const {
    isPending,
    error,
    data: playlist,
  } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getFavoritesPlaylist(id),
    onError: (error) => {
      console.error('Error getting playlist: ', error);
    },
  });

  //TODO: change this to new wrapper component that uses the MovieSlider and makes this request
  // After getting the playlist
  const movieQueries = useQueries({
    queries:
      playlist?.movies?.map((movieId) => ({
        queryKey: ['movie', movieId],
        queryFn: () => getMovie(movieId),
        enabled: !!playlist, // Enables the query only when playlist is loaded
      })) || [], // Returns empty array while playlist is undefined
  });

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error: {error.message}</div>;
  }

  if (playlist?.movies?.length && movieQueries.every((query) => query.isLoading)) {
    return <div>Loading movies...</div>;
  }

  if (movieQueries.some((query) => query.error)) {
    return <div>Error loading some movies...</div>;
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
      <h1>{playlist?.name}</h1>
      <p style={{ marginTop: '0px', marginBottom: '16px' }}>{playlist?.description}</p>

      <MovieSlider flexWrap="wrap">
        {movieQueries.map((query, index) => {
          const movie = query.data;
          return movie ? (
            <MovieCard
              id={movie.id}
              key={index}
              name={movie.title}
              releaseDate={movie.release_date}
              imagePath={movie.poster_path}
              //onDelete={handleDeleteMovie}
            />
          ) : null;
        })}
      </MovieSlider>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
}

export default PlaylistFavorites;
