/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';

const LABELS = {
  0.5: 'Bad',
  1: 'Bad',
  1.5: 'Poor',
  2: 'Poor',
  2.5: 'Ok',
  3: 'Ok',
  3.5: 'Good',
  4: 'Good',
  4.5: 'Excellent',
  5: 'Excellent',
};

function HoverRating({ initialRating, onRatingChange }) {
  const [value, setValue] = React.useState(initialRating);
  const [hover, setHover] = React.useState(-1);

  useEffect(() => {
    setValue(initialRating);
  }, [initialRating]);

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${LABELS[value]}`;
  }

  const CustomRating = styled(Rating)({
    '& .MuiRating-iconEmpty': {
      color: '#f0f0f0', // Change the color of the not selected stars
    },
  });

  return (
    <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <CustomRating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
          onRatingChange(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.5 }} fontSize="inherit" />}
      />
      {value !== null && <Box sx={{ ml: 2 }}>{LABELS[hover !== -1 ? hover : value]}</Box>}
    </Box>
  );
}

export default HoverRating;
