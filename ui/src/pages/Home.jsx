import React from 'react';
import MoviesList from '../components/MoviesList';
import SearchInput from '../components/SearchInput';
import { useQuery } from '@tanstack/react-query';
import useApiServices from '../api';

function Home() {
  const { getMostPopularMovies } = useApiServices();
  const {
    isLoading,
    error,
    data: popularMovies,
  } = useQuery({
    queryKey: ['mostPopularMovies'],
    queryFn: () => getMostPopularMovies(),
  });

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Error loading most popular movies...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Welcome to the home page!</h1>
      <SearchInput />
      <MoviesList movies={popularMovies?.slice(10) || []} isLoading={isLoading} title="Most popular" />
    </div>
  );
}

export default Home;
