import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';

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
      <h1>Movies page</h1>

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
    </div>
  );
}

export default Movies;
