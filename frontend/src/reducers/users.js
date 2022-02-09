import TYPES from '../utils/Types';

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.ULR:
      return { loading: true };
    case TYPES.ULS:
      return { loading: false, userInfo: action.payload };
    case TYPES.ULF:
      return { loading: false, error: action.payload };
    case TYPES.ULT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.URR:
      return { loading: true };
    case TYPES.URS:
      return { loading: false, userInfo: action.payload };
    case TYPES.URF:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case TYPES.UDR:
      return { ...state, loading: true };
    case TYPES.UDS:
      return { loading: false, user: action.payload };
    case TYPES.UDF:
      return { loading: false, error: action.payload };
    case TYPES.UDRS:
      return { user: {} };
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.UUPR:
      return { loading: true };
    case TYPES.UUPS:
      return { loading: false, success: true, userInfo: action.payload };
    case TYPES.UUPF:
      return { loading: false, errorTwo: action.payload };
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case TYPES.ULIR:
      return { loading: true };
    case TYPES.ULIS:
      return { loading: false, users: action.payload.data };
    case TYPES.ULIF:
      return { loading: false, error: action.payload };
    case TYPES.ULIRS:
      return { users: [] };
    default:
      return state;
  }
};
