import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useApiServices from '../api';
import { convertMinutesToHours } from '../utils';
import HoverRating from '../components/HoverRating';
import TextArea from '../components/TextArea';
import CustomSnackbar from '../components/CustomSnackbar';
import CustomPopover from '../components/CustomPopover';
import useSnackbar from '../hooks/useSnackbar';

/**
 * Page with movie's information
 */
function Movie() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getMovie, insertUserMovieLogs, getUserMovieLogsByMovie, getUserPlaylists, addMovieToPlaylist } =
    useApiServices();
  const [isFavorite, setIsFavorite] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for playlists Popover component
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const { snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, closeSnackbar } = useSnackbar();

  //TODO: put this in wrapper component that only has the popover button
  const {
    isPendingPlaylists,
    errorPlaylists,
    data: playlists,
  } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => getUserPlaylists(),
  });

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
    if (playlists && movieLogs) {
      // Disable playlists where the movie is already on
      const updatedPlaylists = playlists.map((playlist) => {
        const isDisabled = movieLogs.playlists.some((logPlaylist) => logPlaylist.id == playlist._id);
        return {
          ...playlist,
          disabled: isDisabled,
        };
      });

      // Remove the "Favorite" playlist because user can add the movie to favorites with the "heart" icone
      // The "Favorite" playlist is the only with no "createdAt" field as this is given by the DB
      const filtered = updatedPlaylists.filter((playlist) => playlist.createdAt);
      setFilteredPlaylists(filtered);
      setIsFavorite(movieLogs.favorite || false);
    }
  }, [movieLogs, playlists]);

  const mutation = useMutation({
    mutationFn: ({ movieId, rating, comment, favorite }) => insertUserMovieLogs(movieId, rating, comment, favorite),
    onSuccess: () => {
      openSnackbar('Movie log updated successfully', 'success');
    },
    onError: () => {
      openSnackbar('Movie log update failed', 'error');
    },
  });

  const mutationAddMovieToPlaylist = useMutation({
    mutationFn: ({ id, movieId }) => addMovieToPlaylist(id, movieId),
    onSuccess: () => {
      openSnackbar('Movie added to playlist successfully', 'success');
      queryClient.invalidateQueries(['logs', id]);
    },
    onError: () => {
      openSnackbar('Movie to playlist failed', 'error');
    },
  });

  const onFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    mutation.mutate({ movieId: movie.id, favorite: newFavoriteStatus });
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  /**
   * When user creates a new playlist, we send the movieId in state so we can add
   * the movie as soon as the playlist is created
   */
  const handlePlaylistSelected = (playlist) => {
    if (playlist === 'new') return navigate('/playlists/new', { state: { movieId: movie.id } });
    mutationAddMovieToPlaylist.mutate({ id: playlist._id, movieId: movie.id });
    handlePopoverClose();
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
            <AddCircleOutlineIcon
              onClick={(event) => setAnchorEl(event.currentTarget)} // Set the anchor element to the add to playlist button that was clicked
              fontSize="large"
              style={{ marginRight: '32px', cursor: 'pointer' }}
            />
            <FavoriteIcon
              onClick={onFavoriteClick}
              fontSize="large"
              style={{ marginRight: '32px', cursor: 'pointer', color: isFavorite ? 'red' : 'gray' }}
            />
            <HoverRating
              initialRating={movieLogs?.rating || 0}
              onRatingChange={(rating) => mutation.mutate({ movieId: movie.id, rating: rating })}
            />
          </div>

          <TextArea
            initialText={movieLogs?.comment || ''}
            onCommentSubmit={(comment) => mutation.mutate({ movieId: movie.id, comment: comment })}
          />
        </Grid>
      </Grid>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />

      <CustomPopover
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        playlists={filteredPlaylists}
        onPlaylistSelected={handlePlaylistSelected}
        navigateToNewPlaylist={() => navigate('/playlists/new', { state: { movieId: movie.id } })}
      />
    </div>
  );
}

export default Movie;
