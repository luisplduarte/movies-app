/* eslint-disable react/prop-types */
import React from 'react';


function MovieSlider({ children }) {
  return (
    <div style={{ width: '70%', display:'flex', flexDirection:'row', gap:'16px', overflow:'auto' }}>
      {children}
    </div>
  );
}

export default MovieSlider;
