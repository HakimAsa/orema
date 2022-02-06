import CONS from '../utils/Constants';
import TYPES from '../utils/Types';

export const cartReducers = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case TYPES.CAI:
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.product === item.product && typeof x.product !== 'undefined'
      );
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) => {
            return x.product === existItem.product &&
              typeof x.product !== 'undefined'
              ? item
              : x;
          }),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item.product && item],
        };
      }
    case TYPES.CRI:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) =>
            x.product !== action.payload && typeof x.product !== 'undefined'
        ),
      };
    case TYPES.CSSA:
      return {
        ...state,
        [CONS.STR_SHIPPING_ADDRESS]: action.payload,
      };
    case TYPES.CSPM:
      return {
        ...state,
        [CONS.STR_PAYMENTMETHOD]: action.payload,
      };
    default:
      return state;
  }
};
