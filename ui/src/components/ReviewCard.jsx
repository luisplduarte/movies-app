/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { truncateString } from '../utils';
import HoverRating from './HoverRating';

export default function ReviewCard({ review }) {
  const navigate = useNavigate();

  const handleButtonPress = () => {
    navigate(`/movies/${review.movieId}`);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 125,
        minWidth: 250,
        backgroundColor: '#b164ff',
        color: 'white',
      }}
    >
      <CardContent sx={{ flexGrow: 1, color: 'white' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '16px',
          }}
        >
          <HoverRating initialRating={review.rating || 0} readOnly={true} />
          <FavoriteIcon
            fontSize="large"
            style={{
              marginRight: '32px',
              color: review.favorite ? 'red' : 'gray',
            }}
          />
        </div>

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            wordWrap: 'break-word',
            textAlign: 'left',
          }}
        >
          {review.comment ? `"${truncateString(review.comment, 28)}"` : 'N/A'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', color: 'white' }}>
        <Button
          sx={{ color: 'white', fontWeight: 'bold' }}
          size="medium"
          onClick={handleButtonPress}
        >
          View movie
        </Button>
      </CardActions>
    </Card>
  );
}
