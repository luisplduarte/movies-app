/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

function TextArea({ initialText, onCommentSubmit }) {
  const [comment, setComment] = useState(initialText || '');

  useEffect(() => {
    setComment(initialText || '');
  }, [initialText]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onCommentSubmit(comment);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        marginTop: '32px',
        '& .MuiTextField-root': { width: '75%' },
        '& .MuiInputLabel-root': {
          color: '#FFFFFFDE', // Label color
          '&.Mui-focused': { color: '#FFFFFFDE' }, // On focus label color
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#FFFFFFDE' }, // Input border
          '&:hover fieldset': { borderColor: 'gray' }, // On hover border
          '&.Mui-focused fieldset': { borderColor: 'gray' }, // On focus border
          color: '#FFFFFFDE', // Text color
        },
      }}
    >
      <TextField
        id="outlined-multiline-flexible"
        label="Leave a comment"
        multiline
        maxRows={6}
        name="comment"
        value={comment}
        onChange={() => setComment(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="submit"
                edge="end"
                sx={{
                  color: '#FFFFFFDE', // Default color
                  '&:hover': {
                    color: '#6200ee', // Color on hover
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default TextArea;
