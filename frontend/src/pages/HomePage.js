import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import Product from '../components/Product';
import { listProducts as lp } from '../actions/products';
import Loader from '../components/Loader';
import Message from '../components/Message';
import translations from '../en';

const HomePage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  useEffect(() => {
    dispatch(lp());
  }, [dispatch]);

  return (
    <>
      <h1>{translations.appLatest}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((p) => (
            <Col key={p._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={p} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomePage;
