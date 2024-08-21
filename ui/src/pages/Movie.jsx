import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import useApiServices from '../api';
import { convertMinutesToHours } from '../utils';
import HoverRating from '../components/HoverRating';
import TextArea from '../components/TextArea';
import CustomSnackbar from '../components/CustomSnackbar';

/**
 * Page with movie's information
 */
function Movie() {
  const { id } = useParams();
  const { getMovie, insertUserMovieLogs, getUserMovieLogsByMovie } = useApiServices();
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const {
    isPending,
    error,
    data: movie,
  } = useQuery({
    queryKey: ['movie', id], //Added the id of the movie so tan query would update cached queries
    queryFn: () => getMovie(id),
  });

  const {
    isPendingLogs,
    errorLogs,
    data: movieLogs,
  } = useQuery({
    queryKey: ['logs', id], //Added the id of the movie so tan query would update cached queries
    queryFn: () => getUserMovieLogsByMovie(id),
  });

  useEffect(() => {
    if (movieLogs) setIsFavorite(movieLogs.favorite || false);
  }, [movieLogs]);

  const mutation = useMutation({
    mutationFn: ({ movieId, rating, comment, favorite }) => insertUserMovieLogs(movieId, rating, comment, favorite),
    onSuccess: () => {
      setSnackbarMessage('Movie log updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    },
    onError: () => {
      setSnackbarMessage('Movie log update failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
  });

  const onRatingChange = (rating) => {
    mutation.mutate({ movieId: movie.id, rating: rating });
  };

  const onFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    mutation.mutate({ movieId: movie.id, favorite: newFavoriteStatus });
  };

  const onCommentSubmit = (comment) => {
    mutation.mutate({ movieId: movie.id, comment: comment });
  };

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

          <div style={{ display: 'flex' }}>
            <FavoriteIcon
              style={{ marginRight: '32px', cursor: 'pointer', color: isFavorite ? 'red' : 'gray' }}
              onClick={onFavoriteClick}
            />
            <HoverRating initialRating={movieLogs.rating || 0} onRatingChange={(value) => onRatingChange(value)} />
          </div>

          <TextArea initialText={movieLogs.comment || ''} onCommentSubmit={onCommentSubmit} />
        </Grid>
      </Grid>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
}

export default Movie;
