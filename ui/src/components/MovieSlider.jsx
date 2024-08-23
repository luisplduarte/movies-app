/* eslint-disable react/prop-types */
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function MovieSlider({ children, flexWrap = 'nowrap' }) {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5,
    },
  };

  const arrowsCustomStyle = {
    top: '25%',
    position: 'absolute',
  }

  const CustomRightArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
        style={{
          ...arrowsCustomStyle,
          right: '3%',
        }}
      >
      </button>
    );
  };
  
  const CustomLeftArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
        style={{
          ...arrowsCustomStyle,
          left: '1%',
        }}
      >
      </button>
    );
  };

  return (
    <div
      style={{
        width: '75%',
      }}
    >
      {flexWrap === 'nowrap' ? (
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
          }}
        >
          <Carousel
            swipeable={false}
            draggable={false}
            responsive={responsive}
            ssr={true} // To render carousel on server-side
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            removeArrowOnDeviceType={['tablet', 'mobile']}
            deviceType="desktop"
            customRightArrow={<CustomRightArrow />}
            customLeftArrow={<CustomLeftArrow />}
          >
            {children}
          </Carousel>
        </div>
      ) : (
        <div
          data-testid="movie-slider"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            overflow: 'auto',
            margin: '0 auto',
            justifyContent: 'center',
            flexWrap: flexWrap,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default MovieSlider;
