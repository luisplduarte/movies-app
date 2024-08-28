/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function MovieCard({ id, name, releaseDate, imagePath, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    onDelete(id); // Call the delete function
  };

  return (
    <Link
      className="movie-card-link"
      data-testid="movie-card"
      to={`/movies/${id}`}
    >
      <div
        className="movie-card-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={
            imagePath
              ? `https://image.tmdb.org/t/p/w500${imagePath}`
              : '/default.png'
          }
          alt={`${name} poster`}
          style={{
            width: '100%',
            aspectRatio: '2/3',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
        <p style={{ marginBottom: '0', color: '#919191' }}>{releaseDate}</p>
        <h3 style={{ marginTop: '0' }}>{name}</h3>

        {isHovered && onDelete && (
          <div
            onClick={handleDeleteClick}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1, // Ensure the delete icon is above other elements
            }}
          >
            <Tooltip title="Remove">
              <IconButton sx={{ color: '#ea0000' }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
