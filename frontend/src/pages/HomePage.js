import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';

import Product from '../components/Product';
import Paginate from '../components/Paginate';
import { listProducts as lp } from '../actions/products';
import Loader from '../components/Loader';
import Message from '../components/Message';
import translations from '../en';

const HomePage = () => {
  let { keyword, pageNumber } = useParams();
  pageNumber = pageNumber || 1;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  useEffect(() => {
    dispatch(lp(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <h1>{translations.appLatest}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((p) => (
              <Col key={p._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={p} />
              </Col>
            ))}
          </Row>
          <Paginate pages={pages} page={page} keyword={keyword || ''} />
        </>
      )}
    </>
  );
};

export default HomePage;
