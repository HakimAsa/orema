import TYPES from '../utils/Types';

export const cartReducers = (state = { cartItems: [] }, action) => {
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
    default:
      return state;
  }
};
