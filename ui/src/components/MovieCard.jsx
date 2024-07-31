/* eslint-disable react/prop-types */
import React from 'react';

function MovieCard({ name, releaseDate, imagePath }) {
  return (
    <div>
      <img
        src={`https://image.tmdb.org/t/p/w500${imagePath}`}
        alt={`${name} poster`}
        style={{ width: '125px', height: '175px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
      />
      <p style={{ marginBottom: '0', color: '#919191' }}>{releaseDate}</p>
      <h3 style={{ marginTop: '0' }}>{name}</h3>
    </div>
  );
}

export default MovieCard;
