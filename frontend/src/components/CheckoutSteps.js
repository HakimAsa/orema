import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import trn from '../en';
import CONS from '../utils/Constants';
import { placeForwardslash as pfs } from '../utils/Globals';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to={pfs(true, CONS.STR_LOGIN)}>
            <Nav.Link>{trn.signIn}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{trn.signIn}</Nav.Link>
        )}
      </Nav.Item>
      <hr />
      <Nav.Item>
        {step2 ? (
          <LinkContainer to={pfs(true, CONS.STR_SHIPPING)}>
            <Nav.Link>{trn.shipping}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{trn.shipping}</Nav.Link>
        )}
      </Nav.Item>
      <hr />
      <Nav.Item>
        {step3 ? (
          <LinkContainer to={pfs(true, CONS.STR_PAYMENT)}>
            <Nav.Link>{trn.payment}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{trn.payment}</Nav.Link>
        )}
      </Nav.Item>
      <hr />
      <Nav.Item>
        {step4 ? (
          <LinkContainer to={pfs(true, CONS.STR_PLACEORDER)}>
            <Nav.Link>{trn.placeOrder}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{trn.placeOrder}</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
