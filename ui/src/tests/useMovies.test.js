import { renderHook } from '@testing-library/react-hooks';
import { useQueries } from '@tanstack/react-query';
import useMovies from '../hooks/useMovies';

const API_URL = 'http://localhost:3000';

globalThis.importMetaEnv = {
  VITE_API_BASE_URL: API_URL,
};

jest.mock('../api', () => {
  const mockApi = {
    getMovie: jest.fn(),
  };
  return jest.fn(() => mockApi);
});

jest.mock('@tanstack/react-query', () => ({
  useQueries: jest.fn(),
}));

describe('useMovies', () => {
  const movieIds = [1, 2, 3];

  it('returns movies info when fetch is successful', async () => {
    const mockMovies = [
      { id: 1, title: 'Movie One' },
      { id: 2, title: 'Movie Two' },
      { id: 3, title: 'Movie Three' },
    ];

    useQueries.mockReturnValue(
      movieIds.map((id, index) => ({
        data: mockMovies[index],
        error: null,
        isLoading: false,
      })),
    );

    const { result } = renderHook(() => useMovies(movieIds));

    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.error).toBe(false);
    expect(result.current.isPending).toBe(false);
  });

  it('returns the error when fetch is not successful', async () => {
    const mockError = new Error('Failed to fetch movie');

    useQueries.mockReturnValue(
      movieIds.map(() => ({
        data: null,
        error: mockError,
        isLoading: false,
      })),
    );

    const { result } = renderHook(() => useMovies(movieIds));

    expect(result.current.movies).toEqual([null, null, null]);
    expect(result.current.error).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it("returns isPending true when ther's still movies getting fetched", async () => {
    useQueries.mockReturnValue(
      movieIds.map((id, index) => ({
        data: index === 0 ? null : { id },
        error: null,
        isLoading: id === 1,
      })),
    );

    const { result } = renderHook(() => useMovies(movieIds));

    expect(result.current.movies).toEqual([null, { id: 2 }, { id: 3 }]);
    expect(result.current.error).toBe(false);
    expect(result.current.isPending).toBe(true);
  });

  it('returns empty array when movieIds is also an empty array', async () => {
    useQueries.mockReturnValue([]);

    const { result } = renderHook(() => useMovies([]));

    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe(false);
    expect(result.current.isPending).toBe(false);
  });

  it('returns empty array when movieIds is undefined', async () => {
    useQueries.mockReturnValue([]);

    const { result } = renderHook(() => useMovies());

    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe(false);
    expect(result.current.isPending).toBe(false);
  });
});
