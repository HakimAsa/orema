import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails } from '../actions/users';
import trn from '../en';
import CONS from '../utils/Constants';
import {
  placeForwardslash as pfs,
  capitalize,
  validInput,
} from '../utils/Globals';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userImage, setUserImage] = useState('/images/akim.jpeg');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const location = useLocation();
  const search = location.search;

  const navigate = useNavigate();

  useEffect(() => {
    if (validInput(userInfo)) {
      navigate(pfs(CONS.STR_FORWARDSLASH, CONS.STR_LOGIN));
    } else {
      if (!validInput(user.name)) {
        dispatch(getUserDetails(CONS.STR_UPDATEDETAILS));
      } else {
        setName(user.name || userInfo.name);
        setEmail(user.email || userInfo.email);
        setPhoneNumber(user.phoneNumber || userInfo.phoneNumber);
        setAddress(user.address || userInfo.address);
        setUserImage(user.userImage || userInfo.userImage);
      }
    }
  }, [navigate, userInfo, dispatch, user]);

  const submitHanler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
    } else {
      // USER PROFILE DISPATCH
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>{trn.userProfile}</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHanler}>
          <Form.Group controlId={trn.myPicture}>
            <Form.Label>{trn.myPicture}</Form.Label>
            <Image
              src={userImage}
              fluid
              rounded
              className="mx-auto px-2 py-3"
              width="150px"
            />
          </Form.Group>
          <Form.Group controlId={trn.name}>
            <Form.Label>{capitalize(trn.name)}</Form.Label>
            <Form.Control
              type={trn.text}
              placeholder={trn.enterName}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId={trn.email}>
            <Form.Label>{trn.emailAddress}</Form.Label>
            <Form.Control
              type={trn.email}
              placeholder={trn.enterEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId={trn.phoneNumber}>
            <Form.Label>{trn.phoneNumer}</Form.Label>
            <Form.Control
              type={trn.text}
              placeholder={trn.enterPhoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId={trn.address}>
            <Form.Label>{trn.address}</Form.Label>
            <Form.Control
              type={trn.text}
              placeholder={trn.enterAddress}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
          <Form.Group controlId={trn.confirmPassword}>
            <Form.Label>{capitalize(trn.confirmPassword)}</Form.Label>
            <Form.Control
              type={trn.password}
              placeholder={trn.enterConfirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" className="my-3" variant="primary">
            {trn.update}
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>{trn.myOrders}</h2>
      </Col>
    </Row>
  );
};

export default ProfilePage;
