import { useQuery } from '@tanstack/react-query';
import useApiServices from '../api';

/**
 * Custom hook to get user's favorite movies playlist from API
 * @returns favorites playlist, the state isPending that is true when data is being fetched and error if any occurred
 */
function useFavoritesPlaylist() {
  const { getFavoritesPlaylist } = useApiServices();

  const {
    data: playlist,
    error,
    isPending,
  } = useQuery({
    queryKey: ['playlist'],
    queryFn: () => getFavoritesPlaylist(),
    onError: (error) => {
      console.error('Error getting playlist: ', error);
    },
  });

  return {
    playlist,
    error,
    isPending,
  };
}

export default useFavoritesPlaylist;
