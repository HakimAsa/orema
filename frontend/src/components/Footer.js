import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import translations from '../en';
import { companyStartDate as csd } from '../utils/Globals';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            Copyright &copy;{`${csd()} ${translations.appName}`}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
