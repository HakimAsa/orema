import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import Rating from './rating/Rating';
import translations from '../en';

export const onSetReviews = (numReviews) => {
  return numReviews >= 2 ? `${numReviews} reviews` : `${numReviews} review`;
};

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.reviewRates}
            onReviewText={onSetReviews(product.totalReview)}
          />
        </Card.Text>

        <Card.Text as="h3">
          {translations.tl}
          {product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
