import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Page with movies
 */
function Movies() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title');
  const { getMoviesByTitle } = useApiServices();

  const {
    isPending,
    error,
    data: movies,
  } = useQuery({
    queryKey: ['movies'],
    queryFn: () => getMoviesByTitle(title),
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Movies page</h1>
      {error ? (
        <p>Error loading movies...</p> // Show error message
      ) : isPending ? (
        <CircularProgress /> // Show pending component
      ) : movies?.length ? (
        <MovieSlider flexWrap="wrap">
          {movies.map((movie, index) => (
            <MovieCard
              id={movie.id}
              key={index}
              name={movie.title}
              releaseDate={movie.release_date}
              imagePath={movie.poster_path}
            />
          ))}
        </MovieSlider>
      ) : (
        <h2>{`No movies found`}</h2>
      )}
    </div>
  );
}

export default Movies;
