import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Row, Button, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orders';
import trn from '../en';
import { capitalize, placeForwardslash as pfs } from '../utils/Globals';
import CONS from '../utils/Constants';

const PlaceOrderPage = () => {
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Calculate prices
  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimal(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimal(cart.itemsPrice > 50 ? 0 : 50); //set it to whatever you want
  cart.taxPrice = addDecimal(Number(0.15 * cart.itemsPrice).toFixed(2)); //15% for TAX
  cart.totalPrice = addDecimal(
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  );

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(pfs(true, CONS.STR_ORDER, order._id));
    }
  }, [navigate, success, order]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
      })
    );
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>{trn.shipping}</h2>
              <p>
                <strong>
                  {capitalize(trn.address)}
                  {CONS.STR_CONS}
                </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{trn.paymentMethod}</h2>
              <strong>
                {trn.method}
                {CONS.STR_CONS}
              </strong>{' '}
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{trn.orderItems}</h2>
              {/* <strong>
                {trn.method}
                {CONS.STR_CONS}
              </strong>{' '} */}
              {cart.cartItems.length === 0 ? (
                <Message variant="danger">{trn.emptyCart}</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={pfs(true, CONS.STR_PRODUCT, item.product)}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {trn.tl}
                          {item.price} = {trn.tl}
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>{trn.orderSummary}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{trn.items}</Col>
                  <Col>
                    {trn.tl}
                    {cart.itemsPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{trn.shipping}</Col>
                  <Col>
                    {trn.tl}
                    {cart.shippingPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{trn.tax}</Col>
                  <Col>
                    {trn.tl}
                    {cart.taxPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{trn.total}</Col>
                  <Col>
                    {trn.tl}
                    {cart.totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item className="d-grid gap-2">
                <Button
                  type={trn.button}
                  disabled={!cart.cartItems.length}
                  onClick={placeOrderHandler}
                >
                  {trn.placeOrder}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
