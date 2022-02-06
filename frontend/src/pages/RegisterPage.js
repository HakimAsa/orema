import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/users';
import trn from '../en';
import CONS from '../utils/Constants';
import {
  placeForwardslash as pfs,
  capitalize,
  validInput,
} from '../utils/Globals';
import FormContainer from '../components/FormContainer';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userImage, setUserImage] = useState('/images/akim.jpeg');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const location = useLocation();
  const search = location.search;

  const redirect = search ? search.split('=')[1] : CONS.STR_FORWARDSLASH;

  const navigate = useNavigate();

  useEffect(() => {
    if (!validInput(userInfo)) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
    } else {
      dispatch(
        register(name, email, password, phoneNumber, address, userImage)
      );
    }
  };
  return (
    <FormContainer>
      <h1>{trn.signUp}</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId={trn.name} className="my-3">
          <Form.Label>{capitalize(trn.name)}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.email} className="my-3">
          <Form.Label>{trn.emailAddress}</Form.Label>
          <Form.Control
            type={trn.email}
            placeholder={trn.enterEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.phoneNumber} className="my-3">
          <Form.Label>{trn.phoneNumer}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterPhoneNumber}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.userImage} className="my-3">
          <Form.Label>{trn.userImage}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterImageUrl}
            value={userImage}
            disabled
            onChange={(e) => setUserImage(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.livingAddress} className="my-3">
          <Form.Label>{trn.livingAddress}</Form.Label>
          <Form.Control
            type={trn.text}
            placeholder={trn.enterAddress}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.password} className="my-3">
          <Form.Label>{capitalize(trn.password)}</Form.Label>
          <Form.Control
            type={trn.password}
            placeholder={trn.enterPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId={trn.confirmPassword} className="my-3">
          <Form.Label>{capitalize(trn.confirmPassword)}</Form.Label>
          <Form.Control
            type={trn.password}
            placeholder={trn.enterConfirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" className="my-3" variant="primary">
          {trn.register}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          {trn.haveAnAcoount}
          <Link
            to={pfs(
              true,
              redirect
                ? `${CONS.STR_LOGIN}${CONS.STR_QM}${CONS.STR_REDIRECT}${CONS.STR_EQ}${redirect}`
                : CONS.STR_LOGIN
            )}
          >
            {' '}
            {trn.login}
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;
