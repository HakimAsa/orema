import axios from 'axios';

import CONS from '../utils/Constants';
import { placeForwardslash as pfs } from '../utils/Globals';
import TYPES from '../utils/Types';
import fld from '../utils/FieldNames';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(
    pfs(true, CONS.STR_API, CONS.STR_PRODUCTS, id)
  );

  dispatch({
    type: TYPES.CAI,
    payload: {
      product: data._id,
      [fld.IMAGE]: data.image,
      [fld.NAME]: data.name,
      [fld.PRICE]: data.price,
      [fld.COUNTINSTOCK]: data.countInStock,
      [fld.QTY]: qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: TYPES.CRI,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItem));
};
