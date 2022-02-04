import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import CONS from './utils/Constants';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import { placeForwardslash as pfs } from './utils/Globals';
import fld from './utils/FieldNames';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path={CONS.STR_FORWARDSLASH} element={<HomePage />} exact />
            <Route
              path={pfs(true, CONS.STR_PRODUCT, `${CONS.STR_CONS}${fld.ID}`)}
              element={<ProductPage />}
            />
            <Route path="/cart" element={<CartPage />}>
              <Route path=":id" element={<CartPage />} />
            </Route>
            <Route path={pfs(true, CONS.STR_LOGIN)} element={<LoginPage />} />
            <Route
              path={pfs(true, CONS.STR_REGISTER)}
              element={<RegisterPage />}
            />
            <Route
              path={pfs(true, CONS.STR_PROFILE)}
              element={<ProfilePage />}
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
