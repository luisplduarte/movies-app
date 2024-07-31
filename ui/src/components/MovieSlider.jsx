/* eslint-disable react/prop-types */
import { display } from '@mui/system';
import React from 'react';
import Slider from 'react-slick';

function MovieSlider({ children }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Show 5 movies at a time
    slidesToScroll: 1,
  };

  return (
    <div style={{ width: '70%' }}>
      <Slider {...settings} style={{ height: '50px', width: '50px' }}>
        {children}
      </Slider>
    </div>
  );
}

export default MovieSlider;
