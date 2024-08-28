import { useQueries } from '@tanstack/react-query';
import useApiServices from '../api';

/**
 * Custom hook to get movies' info from movieDB
 * @param {Array} movieIds array with movies' IDs to be fetched
 * @returns array with movies info, the state isPending that is true when data is being fetched and error if any occurred
 */
function useMovies(movieIds) {
  const { getMovie } = useApiServices();

  const movieQueries = useQueries({
    queries:
      movieIds?.map((movieId) => ({
        queryKey: ['movie', movieId],
        queryFn: () => getMovie(movieId),
        enabled: !!movieIds, // Enable only if movieIds is available
      })) || [], // Return empty array if movieIds is undefined
  });

  const movies = movieQueries.map(query => query.data);
  const isPending = movieQueries.some(query => query.isLoading);
  const error = movieQueries.some(query => query.error);

  return {
    movies,
    isPending,
    error,
  };
}

export default useMovies;
