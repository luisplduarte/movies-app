import React, { useState } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import CustomSnackbar from '../components/CustomSnackbar';
import Button from '@mui/material/Button';

/**
 * Page with movies
 */
function Playlist() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { getPlaylist, getMovie, deleteMovieFromPlaylist } = useApiServices();
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
    queryFn: () => getPlaylist(id),
    onError: (error) => {
      console.error('Error creating playlist: ', error);
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

  const deleteMovieFromPlaylistMutation = useMutation({
    mutationFn: ({ id, movieId }) => deleteMovieFromPlaylist(id, movieId),
    onSuccess: (data, variables) => {
      setSnackbarMessage('Movie log updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      queryClient.invalidateQueries(['playlist', variables.id]);
    },
    onError: () => {
      setSnackbarMessage('Movie log update failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
  });

  const handleDeleteMovie = (movieId) => {
    deleteMovieFromPlaylistMutation.mutate({ id: id, movieId: movieId });
  };

  const handleAddMovie = () => {
    //TODO: maybe change this to a search bar instead of a button
    console.log("add movie pressed")
  };

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
      <Button
        sx={{ color: 'white', fontWeight: 'bold', backgroundColor: '#B164FF', marginBottom: '16px' }}
        size="medium"
        onClick={handleAddMovie}
      >
        Add movie
      </Button>
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
              onDelete={handleDeleteMovie}
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

export default Playlist;
