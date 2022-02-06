import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, NavDropdown, Container, Image } from 'react-bootstrap';

import trn from '../en';
import { placeForwardslash as pfs } from '../utils/Globals';
import CONS from '../utils/Constants';
import { logout } from '../actions/users';
import SearchBar from './SearchBar';

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>{trn.appName}</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBar />
            <Nav className="ms-auto">
              <LinkContainer to={pfs(true, CONS.STR_CART)}>
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>
                  {trn.cart}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown
                    title={userInfo.name}
                    // {`${userInfo.name} ${(
                    //   <Image src={userInfo.userImage} fluid />
                    // )}`}
                    // id={trn.username}
                  >
                    <LinkContainer to={pfs(true, CONS.STR_PROFILE)}>
                      <NavDropdown.Item>{trn.profile}</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      {trn.logout}
                    </NavDropdown.Item>
                  </NavDropdown>
                  {/* todo */}
                  <Image
                    className="my-2"
                    src={userInfo.userImage}
                    alt={userInfo.name}
                    width="35px"
                    height="35px"
                    rounded
                  />
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i>
                    {trn.signIn}
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
