import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/users';
import trn from '../en';
import CONS from '../utils/Constants';
import {
  placeForwardslash as pfs,
  capitalize,
  validInput,
} from '../utils/Globals';
import FormContainer from '../components/FormContainer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const location = useLocation();
  const search = location.search;

  const redirect = search ? search.split('=')[1] : CONS.STR_FORWARDSLASH;

  const navigate = useNavigate();

  useEffect(() => {
    if (!validInput(userInfo)) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  const submitHanler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  return (
    <FormContainer>
      <h1>{trn.signIn}</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHanler}>
        <Form.Group controlId={trn.email}>
          <Form.Label>{trn.emailAddress}</Form.Label>
          <Form.Control
            type={trn.email}
            placeholder={trn.enterEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.password}>
          <Form.Label>{capitalize(trn.password)}</Form.Label>
          <Form.Control
            type={trn.password}
            placeholder={trn.enterPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" className="my-3" variant="primary">
          {trn.signIn}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          {trn.newCustomer}
          <Link
            to={pfs(
              true,
              redirect
                ? `${CONS.STR_REGISTER}${CONS.STR_QM}${CONS.STR_REDIRECT}${CONS.STR_EQ}${redirect}`
                : CONS.STR_REGISTER
            )}
          >
            {' '}
            {trn.register}
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
