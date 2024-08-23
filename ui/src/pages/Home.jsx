import React from 'react';
import MoviesList from '../components/MoviesList';
import SearchInput from '../components/SearchInput';
import { useQuery } from '@tanstack/react-query';
import useApiServices from '../api';
import CircularProgress from '@mui/material/CircularProgress';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Welcome to the home page!</h1>
      <SearchInput />
      {error ? (
        <p>Error loading popular movies...</p> // Show error message
      ) : isLoading ? (
        <CircularProgress /> // Show pending component
      ) : popularMovies ? (
        <MoviesList movies={popularMovies?.slice(10) || []} title="Most popular" />
      ) : (
        <h2>{`No popular movies found.`}</h2>
      )}
    </div>
  );
}

export default Home;
