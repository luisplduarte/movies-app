import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlaylistFavorites from '../pages/PlaylistFavorites';
import useFavoritesPlaylist from '../hooks/useFavoritesPlaylist';
import useMovies from '../hooks/useMovies';

const API_URL = 'http://localhost:3000';

globalThis.importMetaEnv = {
  VITE_API_BASE_URL: API_URL,
};

jest.mock('../hooks/useFavoritesPlaylist');
jest.mock('../hooks/useMovies');
jest.mock('../api', () => {
  return {
    __esModule: true,
    default: {
      baseURL: API_URL,
    },
  };
});

const renderFavoritesPage = () => {
  return render(
    <MemoryRouter initialEntries={['/favorites/1']}>
      <Routes>
        <Route path="/favorites/:id" element={<PlaylistFavorites />} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockUseFavoritesPlaylist = (playlist = null, error = null, isPending = false) => {
  useFavoritesPlaylist.mockReturnValue({
    playlist,
    error,
    isPending,
  });
};

const mockUseMovies = (movies = [], error = null, isPending = false) => {
  useMovies.mockReturnValue({
    movies,
    error,
    isPending,
  });
};

describe('PlaylistFavorites Component', () => {
  const mockPlaylist = {
    name: 'Favorites',
    description: 'Playlist with all your favorite movies!',
    movies: [1, 2, 3],
  };

  const mockMovies = [
    { id: '1', title: 'Movie One', release_date: '2020-01-01', poster_path: '/path/to/poster1.jpg' },
    { id: '2', title: 'Movie Two', release_date: '2021-01-01', poster_path: '/path/to/poster2.jpg' },
    { id: '3', title: 'Movie Three', release_date: '2022-01-01', poster_path: '/path/to/poster3.jpg' },
  ];

  it("renders only favorites playlist info when there's no favorite movies", () => {
    mockUseFavoritesPlaylist({ name: 'Favorites', description: 'Playlist with all your favorite movies!', movies: [] });
    mockUseMovies();

    const { getByTestId, queryByTestId, getByText } = renderFavoritesPage();

    expect(getByTestId('name').textContent).toBe('Favorites');
    expect(getByTestId('description').textContent).toBe('Playlist with all your favorite movies!');
    expect(getByText('No movies found')).toBeInTheDocument();
    expect(queryByTestId('movie-card')).toBeNull(); // movieCards should be null or empty
  });

  it("renders one movie when there's only one marked as favorite", () => {
    mockUseFavoritesPlaylist({ ...mockPlaylist, movies: [1] });
    mockUseMovies([mockMovies[0]]);

    const { queryAllByTestId } = renderFavoritesPage();

    const movieCards = queryAllByTestId('movie-card');
    expect(movieCards.length).toBe(1);
    expect(movieCards[0]).toHaveTextContent('Movie One');
  });

  it("renders list of movies when there's several marked as favorite", () => {
    mockUseFavoritesPlaylist(mockPlaylist);
    mockUseMovies(mockMovies);

    const { queryAllByTestId } = renderFavoritesPage();

    const movieCards = queryAllByTestId('movie-card');
    expect(movieCards.length).toBe(3);
    expect(movieCards[0]).toHaveTextContent('Movie One');
    expect(movieCards[1]).toHaveTextContent('Movie Two');
    expect(movieCards[2]).toHaveTextContent('Movie Three');
  });

  it('shows loading component when playlist is loading', () => {
    mockUseFavoritesPlaylist(null, null, true);
    mockUseMovies();

    const { getByTestId } = renderFavoritesPage();
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows loading component when movies are loading', () => {
    mockUseFavoritesPlaylist(mockPlaylist);
    mockUseMovies([], null, true);

    const { getByTestId } = renderFavoritesPage();
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows an error message when there is an error loading the playlist', () => {
    mockUseFavoritesPlaylist(null, { message: 'Failed to load playlist' });
    mockUseMovies();

    const { getByText } = renderFavoritesPage();
    expect(getByText('Error: Failed to load playlist')).toBeInTheDocument();
  });

  it('shows an error message when there is an error loading movies', () => {
    mockUseFavoritesPlaylist(mockPlaylist);
    mockUseMovies([], { message: 'Failed to load movies' });

    const { getByText } = renderFavoritesPage();
    expect(getByText('Error loading some movies...')).toBeInTheDocument();
  });
});
