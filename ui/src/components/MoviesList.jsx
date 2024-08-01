import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import useApiServices from '../api';
import MovieCard from './MovieCard';
import MovieSlider from './MovieSlider';

function MoviesList() {
  const { getMostPopularMovies } = useApiServices();
  const {
    isLoading,
    error,
    data: popularMovies,
  } = useQuery({
    queryKey: ['mostPopularMovies'], // React query uses this key to cache purposes
    queryFn: () => getMostPopularMovies(),
  });

  useEffect(() => {
    console.log('most popular movies = ', popularMovies);
  }, [popularMovies]);

  if (error) {
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <p>Error loading most popular movies...</p>
    </div>;
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
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <h2 style={{ marginBottom: '0px', alignItems:'start' }}>Most popular</h2>
          <MovieSlider>
            {popularMovies.map((movie, index) => (
              <MovieCard
                id={movie.id}
                key={index}
                name={movie.title}
                releaseDate={movie.release_date}
                imagePath={movie.poster_path}
              />
            ))}
          </MovieSlider>
        </>
      )}
    </div>
  );
}

export default MoviesList;
