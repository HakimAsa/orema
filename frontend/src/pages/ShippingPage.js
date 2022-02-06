import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/carts';
import trn from '../en';
import { capitalize, placeForwardslash as pfs } from '../utils/Globals';
import CONS from '../utils/Constants';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [country, setCountry] = useState(shippingAddress.country);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, country, postalCode }));
    navigate(pfs(true, CONS.STR_PAYMENT));
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>{trn.shipping}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId={trn.address} className="my-3">
          <Form.Label>{capitalize(trn.address)}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterAddress}
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.city} className="my-3">
          <Form.Label>{capitalize(trn.city)}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterCity}
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.postalCode} className="my-3">
          <Form.Label>{capitalize(trn.postalCode)}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterPostalCode}
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.country} className="my-3">
          <Form.Label>{capitalize(trn.country)}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterCountry}
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type={trn.submit} varaiant={trn.primary} className="my-3">
          {trn.continue}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
