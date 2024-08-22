import React from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import CustomSnackbar from '../components/CustomSnackbar';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import SearchAutoComplete from '../components/SearchAutoComplete';
import useSnackbar from '../hooks/useSnackbar';

/**
 * Page with movies
 */
function Playlist() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getPlaylist, getMovie, deleteMovieFromPlaylist, addMovieToPlaylist } = useApiServices();
  const { snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, closeSnackbar } = useSnackbar();

  const {
    isPending,
    error,
    data: playlist,
  } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylist(id),
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

  const deleteMovieFromPlaylistMutation = useMutation({
    mutationFn: ({ id, movieId }) => deleteMovieFromPlaylist(id, movieId),
    onSuccess: (data, variables) => {
      openSnackbar('Movie removed from playlist successfully', 'success');
      queryClient.invalidateQueries(['playlist', variables.id]);
    },
    onError: () => {
      openSnackbar('Movie delete failed', 'error');
    },
  });

  const mutationAddMovieToPlaylist = useMutation({
    mutationFn: ({ id, movieId }) => addMovieToPlaylist(id, movieId),
    onSuccess: (data, variables) => {
      openSnackbar('Movie added to playlist successfully', 'success');
      queryClient.invalidateQueries(['playlist', variables.id]);
    },
    onError: () => {
      openSnackbar('Adding movie to playlist failed', 'error');
    },
  });

  const handleDeleteMovie = (movieId) => {
    deleteMovieFromPlaylistMutation.mutate({ id: id, movieId: movieId });
  };

  const handleAddMovie = (movie) => {
    mutationAddMovieToPlaylist.mutate({ id: playlist._id, movieId: movie.id });
  };

  const handleEditPlaylist = () => {
    navigate(`/playlists/${playlist._id}/edit`);
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

      <Box display="flex" justifyContent="center" alignItems="center" gap="32px" marginBottom="16px">
        <SearchAutoComplete onOptionSelect={handleAddMovie} />
        <Button
          sx={{ color: 'white', fontWeight: 'bold', backgroundColor: '#B164FF' }}
          size="medium"
          onClick={handleEditPlaylist}
        >
          <EditIcon sx={{ marginRight: '4px' }} />
          Playlist
        </Button>
      </Box>

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
        onClose={closeSnackbar}
      />
    </div>
  );
}

export default Playlist;
