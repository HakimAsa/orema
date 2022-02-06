import React from 'react';
import PropTypes from 'prop-types';
import Star from './Star';

const Rating = ({ value, onReviewText }) => {
  return (
    <>
      <div className="rating">
        <Star value={value} />
        <span style={{ paddingLeft: '20px' }}>
          {onReviewText && onReviewText}
        </span>
      </div>
    </>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  onReviewText: PropTypes.string.isRequired,
};

export default Rating;
