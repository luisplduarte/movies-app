import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoviesList from '../components/MoviesList';

function Home() {
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    console.log('searchInput changed to = ', searchInput);
  }, [searchInput]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    //TODO: later on, change the behavior on what to do with the user input
    console.log('Searching for:', searchInput);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Welcome to the home page!</h1>
      <Link to="/profile">Go to profile page</Link>

      {/* TODO: put this Input component in it's own component  */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', margin: '16px' }}>
        <TextField
          variant="outlined"
          placeholder="Search for a movie"
          value={searchInput}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#ffffff' }} />
              </InputAdornment>
            ),
            style: {
              color: '#ffffff', // Change text color
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#b164ff', // Default border color
              },
              '&:hover fieldset': {
                borderColor: '#6200ee', // Border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6200ee', // Border color when focused
              },
            },
          }}
        />
      </form>

      <MoviesList />
    </div>
  );
}

export default Home;
