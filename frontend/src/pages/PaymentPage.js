import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/carts';
import trn from '../en';
import { placeForwardslash as pfs } from '../utils/Globals';
import CONS from '../utils/Constants';

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();

  if (!shippingAddress) {
    navigate(pfs(true, CONS.STR_SHIPPING));
  }

  const [paymentMethod, setPaymentMethod] = useState(trn.paypal);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate(pfs(true, CONS.STR_PLACEORDER));
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>{trn.paymentMethod}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId={trn.paymentMethod} className="my-3">
          <Form.Label as="legend">{trn.selectMethod}</Form.Label>

          <Col>
            <Form.Check
              type={trn.radio}
              label="PayPal or Credit Card"
              id={trn.paypal}
              name="paymentMethod"
              value={trn.paypal}
              checked
              variant="success"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type={trn.radio}
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type={trn.submit} varaiant={trn.primary} className="my-3">
          {trn.continue}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;
