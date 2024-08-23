import React from 'react';
import { useParams } from 'react-router-dom';
import useFavoritesPlaylist from '../hooks/useFavoritesPlaylist';
import useMovies from '../hooks/useMovies';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Page with favorites playlist
 */
function PlaylistFavorites() {
  const { id } = useParams();
  const { playlist, error: playlistError, isPending } = useFavoritesPlaylist(id);
  const { movies, isPending: moviesLoading, error: moviesError } = useMovies(playlist?.movies);

  if (moviesError) {
    return <div>Error loading some movies...</div>;
  }

  return (
    <div>
      {isPending ? (
        <CircularProgress data-testid="loading-spinner" />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1 data-testid="name">{playlist?.name}</h1>
          <p style={{ marginTop: '0px', marginBottom: '16px' }} data-testid="description">
            {playlist?.description}
          </p>
          {playlistError ? (
            <p>Error: {playlistError.message}</p> // Show error message
          ) : moviesLoading ? (
            <CircularProgress data-testid="loading-spinner" /> // Show pending component
          ) : movies?.length ? (
            <MovieSlider flexWrap="wrap">
              {movies?.map((movie, index) => {
                return movie ? (
                  <MovieCard
                    id={movie.id}
                    key={index}
                    name={movie.title}
                    releaseDate={movie.release_date}
                    imagePath={movie.poster_path}
                  />
                ) : null;
              })}
            </MovieSlider>
          ) : (
            <h2>{`No movies found`}</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default PlaylistFavorites;
