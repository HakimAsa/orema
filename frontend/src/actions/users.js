import axios from 'axios';

import CONS from '../utils/Constants';
import { dispatchOnFail, placeForwardslash as pfs } from '../utils/Globals';
import TYPES from '../utils/Types';
import fld from '../utils/FieldNames';
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: TYPES.ULR,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      pfs(true, CONS.STR_API, CONS.STR_AUTH, CONS.STR_LOGIN),
      {
        [fld.EMAIL]: email,
        [fld.PASSWORD]: password,
      },
      config
    );

    dispatch({
      type: TYPES.ULS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.ULF, response);
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: TYPES.ULT });
  dispatch({ type: TYPES.UDRS });
  dispatch({ type: TYPES.OLMRS });
  dispatch({ type: TYPES.ULIRS });
};

export const register =
  (name, email, password, phoneNmber, address, userImage) =>
  async (dispatch) => {
    try {
      dispatch({
        type: TYPES.URR,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        pfs(true, CONS.STR_API, CONS.STR_AUTH, CONS.STR_REGISTER),
        {
          [fld.NAME]: name,
          [fld.EMAIL]: email,
          [fld.PASSWORD]: password,
          [fld.USERIMAGE]: userImage,
          [fld.ADDRESS]: address,
          [fld.PHONENUMBER]: phoneNmber,
        },
        config
      );

      dispatch({
        type: TYPES.URS,
        payload: data,
      });

      dispatch({
        type: TYPES.ULS,
        payload: data,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch ({ response }) {
      return dispatchOnFail(dispatch, TYPES.URF, response);
    }
  };

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPES.UDR,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      pfs(true, CONS.STR_API, CONS.STR_AUTH, id),
      config
    );

    dispatch({
      type: TYPES.UDS,
      payload: data.data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.UDF, response);
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPES.UUPR,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      pfs(true, CONS.STR_API, CONS.STR_AUTH, CONS.STR_UPDATEDETAILS),
      user,
      config
    );

    dispatch({
      type: TYPES.UUPS,
      payload: data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.UUPF, response);
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPES.ULIR,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      pfs(true, CONS.STR_API, CONS.STR_USERS),
      config
    );

    dispatch({
      type: TYPES.ULIS,
      payload: data,
    });
  } catch ({ response }) {
    return dispatchOnFail(dispatch, TYPES.ULIF, response);
  }
};
