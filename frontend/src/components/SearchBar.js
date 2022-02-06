import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import trn from '../en';
import CONS from '../utils/Constants';
import { placeForwardslash as pfs } from '../utils/Globals';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(pfs(true, CONS.STR_SEARCH, keyword));
    } else {
      navigate(CONS.STR_FORWARDSLASH);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type={trn.text}
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={trn.searchProducts}
        className="me-sm-0"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        {trn.search}
      </Button>
    </Form>
  );
};

export default SearchBar;
