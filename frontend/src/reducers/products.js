import TYPES from '../utils/Types';

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case TYPES.PLR:
      return { loading: true, products: [] };
    case TYPES.PLS:
      return {
        loading: false,
        products: action.payload.data,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case TYPES.PLF:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case TYPES.PDR:
      return { loading: true, ...state };
    case TYPES.PDS:
      return { loading: false, product: action.payload };
    case TYPES.PDF:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
