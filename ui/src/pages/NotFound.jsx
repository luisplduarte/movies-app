import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link
        to="/"
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#6200ee',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
