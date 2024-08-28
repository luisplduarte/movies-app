/* eslint-disable react/prop-types */
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import MovieCard from './MovieCard';
import MovieSlider from './MovieSlider';

function MoviesList({ movies, isLoading, title }) {
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '16px',
        width: '100%',
      }}
    >
      <h2 style={{ marginBottom: '8px' }}>{title}</h2>
      <MovieSlider>
        {movies?.map((movie, index) => (
          <MovieCard
            id={movie.id}
            key={index}
            name={movie.title}
            releaseDate={movie.release_date}
            imagePath={movie.poster_path}
          />
        ))}
      </MovieSlider>
    </div>
  );
}

export default MoviesList;
