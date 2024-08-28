import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchInput() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/movies?title=${encodeURIComponent(searchInput)}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', margin: '16px', width: '70%' }}>
      <TextField
        variant="outlined"
        placeholder="Search for a movie"
        value={searchInput}
        onChange={() => setSearchInput(event.target.value)}
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
          width: '100%',
        }}
      />
    </form>
  );
}

export default SearchInput;
