import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@tanstack/react-query';
import useFavoritesPlaylist from '../hooks/useFavoritesPlaylist';

const API_URL = 'http://localhost:3000';

globalThis.importMetaEnv = {
  VITE_API_BASE_URL: API_URL,
};

// Mock of api.js module
jest.mock('../api', () => {
  const mockApi = {
    getFavoritesPlaylist: jest.fn(),
  };
  return jest.fn(() => mockApi);
});

// Mock of `@tanstack/react-query`'s `useQuery`
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useFavoritesPlaylist', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns playlist data when fetching is successful', async () => {
    const mockPlaylist = {
      name: 'Favorites',
      description: 'Playlist with all your favorite movies!',
      movies: [1, 2, 3],
    };

    useQuery.mockReturnValue({
      data: mockPlaylist,
      error: null,
      isPending: false,
    });

    const { result } = renderHook(() => useFavoritesPlaylist());

    expect(result.current.playlist).toEqual(mockPlaylist);
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it('returns error when fetching fails', async () => {
    const mockError = new Error('Failed to fetch playlist');

    useQuery.mockReturnValue({
      data: null,
      error: mockError,
      isPending: false,
    });

    const { result } = renderHook(() => useFavoritesPlaylist());

    expect(result.current.playlist).toBeNull();
    expect(result.current.error).toEqual(mockError);
    expect(result.current.isPending).toBe(false);
  });

  it('returns isPending as true when data is being fetched', async () => {
    useQuery.mockReturnValue({
      data: null,
      error: null,
      isPending: true,
    });

    const { result } = renderHook(() => useFavoritesPlaylist());

    expect(result.current.playlist).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(true);
  });
});
