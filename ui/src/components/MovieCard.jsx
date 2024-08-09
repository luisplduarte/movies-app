/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ id, name, releaseDate, imagePath }) {
  return (
    <Link to={`/movies/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        key={id}
        style={{
          width: '150px', // Define fixed width for movie cards
        }}
      >
        <img
          src={imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : '/default.png'}
          alt={`${name} poster`}
          style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px' }}
        />
        <p style={{ marginBottom: '0', color: '#919191' }}>{releaseDate}</p>
        <h3 style={{ marginTop: '0' }}>{name}</h3>
      </div>
    </Link>
  );
}

export default MovieCard;
