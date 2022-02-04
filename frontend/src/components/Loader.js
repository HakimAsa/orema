import React from 'react';
import { Spinner } from 'react-bootstrap';
import translations from '../en';

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      stype={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
    >
      <span className="sr-only">{translations.loading}</span>
    </Spinner>
  );
};

export default Loader;
