/* eslint-disable react/prop-types */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function BasicCard({ title, description, buttonText = 'View movies', onButtonPressed }) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 220,
        minWidth: 275,
        backgroundColor: '#b164ff',
        color: 'white',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" sx={{ marginBottom: '16px' }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            wordWrap: 'break-word',
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', color: 'white' }}>
        <Button sx={{ color: 'white', fontWeight: 'bold' }} size="medium" onClick={onButtonPressed}>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
}
