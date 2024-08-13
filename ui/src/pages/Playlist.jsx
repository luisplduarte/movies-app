import React, { useEffect, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useParams, useLocation } from 'react-router-dom';
import useApiServices from '../api';
import MovieSlider from '../components/MovieSlider';
import MovieCard from '../components/MovieCard';

/**
 * Page with movies
 */
function Playlist() {
  const { id } = useParams();
  const { getPlaylist, getMovie } = useApiServices();

  const { isPending, error, data: playlist } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylist(id),
    onError: (error) => {
      console.error('Error creating playlist: ', error);
    },
  });

  //TODO: change this to new wrapper component that uses the MovieSlider and makes this request
  // After getting the playlist
  const movieQueries = useQueries({
    queries:
      playlist?.movies?.map((movieId) => ({
        queryKey: ['movie', movieId],
        queryFn: () => getMovie(movieId),
        enabled: !!playlist, // Enables the query only when playlist is loaded
      })) || [], // Returns empty array while playlist is undefined
  });

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error: {error.message}</div>;
  }

  if (playlist?.movies?.length && movieQueries.every((query) => query.isLoading)) {
    return <div>Loading movies...</div>;
  }

  if (movieQueries.some((query) => query.error)) {
    return <div>Error loading some movies...</div>;
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
      <h1>Playlist - {playlist?.name}</h1>
      <h2 style={{ marginBottom: '0px' }}>Description</h2>
      <p style={{ marginTop: '0px' }}>{playlist?.description}</p>

      <MovieSlider flexWrap="wrap">
        {movieQueries.map((query, index) => {
          const movie = query.data;
          return movie ? (
            <MovieCard
              id={movie.id}
              key={index}
              name={movie.title}
              releaseDate={movie.release_date}
              imagePath={movie.poster_path}
            />
          ) : null;
        })}
      </MovieSlider>
    </div>
  );
}

export default Playlist;
