/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, InputAdornment, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '@uidotdev/usehooks';
import useApiServices from '../api';

function SearchAutoComplete({ onOptionSelect }) {
  const { getMoviesByTitle } = useApiServices();
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [options, setOptions] = useState([]);
  const [optionsText, setOptionsText] = useState('Insert text...');

  useEffect(() => {
    const fetchMovies = async () => {
      if (debouncedInputValue) {
        setOptionsText('Loading...');
        const movies = await getMoviesByTitle(debouncedInputValue);
        const moviesFormated = movies.map((movie) => ({ label: movie.title, id: movie.id }));
        setOptions(moviesFormated);
      } else {
        setOptions([]);
        setOptionsText('Insert text...');
      }
    };

    fetchMovies();
  }, [debouncedInputValue]);

  const handleBlur = () => {
    setOptions([]);
    setOptionsText('Insert text...');
  };

  const handleOptionSelect = (event, value) => {
    event.preventDefault();
    if (value) {
      onOptionSelect(value);
      setInputValue('');
    }
  };

  return (
    <Autocomplete
      noOptionsText={<Typography sx={{ color: '#ffffff' }}>{optionsText}</Typography>}
      disablePortal
      id="search-auto-complete"
      options={options}
      onBlur={handleBlur}
      onChange={handleOptionSelect}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      sx={{ width: 400 }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search for a movie"
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            ...params.InputProps,
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
      )}
      PaperComponent={(props) => (
        <Paper
          {...props}
          sx={{
            backgroundColor: '#333333', // Options background color
            color: '#ffffff', // Options text color
            '& .MuiAutocomplete-option': {
              '&:hover': {
                backgroundColor: '#b164ff', // Hover background color
              },
              '&[data-focus="true"]': {
                backgroundColor: '#b164ff', // Focus background color
              },
            },
          }}
        />
      )}
    />
  );
}

export default SearchAutoComplete;
