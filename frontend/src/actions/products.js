import axios from 'axios';

import CONS from '../utils/Constants';
import { dispatchOnFail, placeForwardslash as pfs } from '../utils/Globals';
import TYPES from '../utils/Types';

export const listProducts =
  (keyword = '', pageNumber = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: TYPES.PLR });
      const { data } = await axios.get(
        pfs(
          true,
          CONS.STR_API,
          `${CONS.STR_PRODUCTS}?keyword=${keyword}&pageNumber=${pageNumber}`
        )
      );
      dispatch({
        type: TYPES.PLS,
        payload: data,
      });
    } catch ({ response }) {
      return dispatchOnFail(dispatch, TYPES.PLF, response);
    }
  };
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.PDR });
    const { data } = await axios.get(
      pfs(true, CONS.STR_API, CONS.STR_PRODUCTS, id)
    );
    dispatch({
      type: TYPES.PDS,
      payload: data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.PDF, response);
  }
};
