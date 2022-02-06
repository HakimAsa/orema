import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Image, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/users';
import { listMyOrders } from '../actions/orders';
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

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingMyList, error: errorMyList, orders } = orderMyList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, errorTwo } = userUpdateProfile;

  const navigate = useNavigate();

  useEffect(() => {
    if (validInput(userInfo)) {
      navigate(pfs(CONS.STR_FORWARDSLASH, CONS.STR_LOGIN));
    } else {
      if (validInput(user && user.name)) {
        dispatch(getUserDetails(CONS.STR_ME));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setAddress(user.address);
        setUserImage(user.userImage);
      }
    }
  }, [navigate, userInfo, dispatch, user]);

  const submitHanler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
    } else {
      const fieldsToUpdate = {
        id: user._id,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        userImage: userImage,
        address: address,
        password,
      };

      if (password === '') delete fieldsToUpdate.password;
      dispatch(updateUserProfile(fieldsToUpdate));
      setMessage('');
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>{trn.userProfile}</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {errorTwo && <Message variant="danger">{errorTwo}</Message>}
        {success && <Message variant="success">{trn.profileUpdated}</Message>}
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
        {loadingMyList ? (
          <Loader />
        ) : errorMyList ? (
          <Message variant="danger">{errorMyList}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt && order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={pfs(true, CONS.STR_ORDER, order._id)}>
                      <Button className="btn-sm" variant="light">
                        {trn.details}
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
