import React from 'react';
import PropTypes from 'prop-types';

const Star = ({ value, color, treshold }) => {
  return Array.from(Array(treshold), (_, index) => {
    return (
      <span key={index}>
        <i
          style={{ color, height: '10px', width: '10px' }}
          className={
            value >= index + 1 //should not start with 0 base
              ? 'fas fa-star'
              : value >= index + 1 + 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
    );
  });
};

Star.defaultProps = {
  color: 'blue', //#f8e825
  treshold: 5, //defaukt last
};

Star.propTypes = {
  value: PropTypes.number.isRequired,
  treshold: PropTypes.number,
  color: PropTypes.string,
};

export default Star;
