import React, { useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { addToCart, removeFromCart } from '../actions/carts';
import translations from '../en';
import CONS from '../utils/Constants';
import { placeForwardslash as pfs } from '../utils/Globals';

const CartPage = () => {
  const productId = useParams();

  const location = useLocation();
  const search = location.search;

  const qty = search ? Number(search.split('=')[1]) : 1;

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  useEffect(() => {
    if (productId && Object.keys(productId).length) {
      dispatch(addToCart(productId.id, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = () => {
    navigate(
      pfs(
        true,
        `${CONS.STR_LOGOUT}${CONS.STR_QM}${CONS.STR_REDIRECT}${CONS.STR_EQ}${CONS.STR_SHIPPING}`
      )
    );
  };
  return (
    <Row>
      <Col md={8}>
        <h1>{translations.shoppingCart}</h1>
        {cartItems.length === 0 ? (
          <>
            <Message>{translations.emptyCart}</Message>
            <Link to={CONS.STR_FORWARDSLASH}>{translations.goBack}</Link>
          </>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map(
              (item) =>
                //todo why item has {qty: 1} by default: reducers to be checked
                item &&
                item.product && (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={pfs(true, CONS.STR_PRODUCT, item.product)}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={2}>
                        {' '}
                        {translations.tl}
                        {item.price}
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i
                            className="fas fa-trash"
                            style={{ color: 'tomato' }}
                          ></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
            )}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                {translations.subtotal} (
                {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                {translations.items}
              </h2>
              {translations.tl}
              {cartItems
                .reduce((acc, item) => acc + Number(item.qty * item.price), 0)
                .toFixed(2)}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={!cartItems.length}
                onClick={checkoutHandler}
              >
                {translations.proceedToCheckout}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
