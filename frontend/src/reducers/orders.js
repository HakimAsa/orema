// import CONS from '../utils/Constants';
import TYPES from '../utils/Types';

export const orderCreateReducers = (state = {}, action) => {
  switch (action.type) {
    case TYPES.OCR:
      return {
        loading: true,
      };
    case TYPES.OCS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case TYPES.OCF:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDetailsReducers = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case TYPES.ODR:
      return {
        ...state,
        loading: true,
      };
    case TYPES.ODS:
      return {
        loading: false,
        order: action.payload,
      };
    case TYPES.ODF:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderPayReducers = (state = {}, action) => {
  switch (action.type) {
    case TYPES.OPR:
      return {
        loading: true,
      };
    case TYPES.OPS:
      return {
        loading: false,
        success: true,
      };
    case TYPES.OPF:
      return { loading: false, error: action.payload };
    case TYPES.OPRS:
      return {};
    default:
      return state;
  }
};

export const orderMyListReducers = (state = { orders: [] }, action) => {
  switch (action.type) {
    case TYPES.OLMR:
      return {
        loading: true,
      };
    case TYPES.OLMS:
      return {
        loading: false,
        orders: action.payload,
      };
    case TYPES.OLMF:
      return { loading: false, error: action.payload };

    case TYPES.OLMRS:
      return { orders: [] };
    default:
      return state;
  }
};
