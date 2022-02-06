import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import CONS from '../utils/Constants';

import { placeForwardslash as pfs } from '../utils/Globals';

const Paginate = ({ pages, page, keyword = '', isAdmin = false }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              keyword
                ? pfs(true, CONS.STR_SEARCH, keyword, CONS.STR_PAGE, x + 1)
                : pfs(true, CONS.STR_PAGE, x + 1)
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
