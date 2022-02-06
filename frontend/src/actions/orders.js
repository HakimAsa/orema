import axios from 'axios';

import CONS from '../utils/Constants';
import { placeForwardslash as pfs, dispatchOnFail } from '../utils/Globals';
import TYPES from '../utils/Types';
// import fld from '../utils/FieldNames';

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPES.OCR,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      pfs(true, CONS.STR_API, CONS.STR_ORDERS),
      order,
      config
    );

    dispatch({
      type: TYPES.OCS,
      payload: data.data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.OCF, response);
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPES.ODR,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      pfs(true, CONS.STR_API, CONS.STR_ORDERS, id),
      config
    );

    dispatch({
      type: TYPES.ODS,
      payload: data.data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.ODF, response);
  }
};
export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({
        type: TYPES.OPR,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        pfs(true, CONS.STR_API, CONS.STR_ORDERS, orderId, CONS.STR_PAY),
        paymentResult,
        config
      );

      dispatch({
        type: TYPES.OPS,
        payload: data.data,
      });
    } catch ({ response }) {
      return dispatchOnFail(dispatch, TYPES.OPF, response);
    }
  };

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPES.OLMR,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      pfs(true, CONS.STR_API, CONS.STR_ORDERS, CONS.STR_MYORDERS),
      config
    );

    dispatch({
      type: TYPES.OLMS,
      payload: data.data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.OPF, response);
  }
};
