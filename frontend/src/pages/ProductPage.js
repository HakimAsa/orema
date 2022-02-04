import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';

import Rating from '../components/rating/Rating';
import translations from '../en';
import { onSetReviews } from '../components/Product';
import CONS from '../utils/Constants';
import { listProductDetails as lpd } from '../actions/products';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { placeForwardslash as pfs } from '../utils/Globals';

const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(lpd(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(
      pfs(
        true,
        CONS.STR_CART,
        `${id}${CONS.STR_QM}${CONS.STR_QTY}${CONS.STR_EQ}${qty}`
      )
    );
  };
  return (
    <>
      <Link to={CONS.STR_FORWARDSLASH} className="btn btn-light my-3">
        {translations.goBack}
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.reviewRates || 0}
                  onReviewText={onSetReviews(product.totalReview)}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                {translations.price}
                {CONS.STR_CONS} {translations.tl}
                {product.price}
              </ListGroup.Item>

              <ListGroup.Item>
                {translations.description}
                {CONS.STR_CONS} {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      {translations.price}
                      {CONS.STR_CONS}
                    </Col>
                    <Col>
                      <strong>
                        {translations.tl}
                        {product.price}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      {translations.status}
                      {CONS.STR_CONS}
                    </Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0
                          ? translations.inStock
                          : translations.outOfStock}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock >= 1 && (
                  <ListGroup.Item>
                    <Row>
                      <Col> {translations.qty}</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    type="button"
                    disabled={!product.countInStock}
                  >
                    {translations.addToCart}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductPage;
