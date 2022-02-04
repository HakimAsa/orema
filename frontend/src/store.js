import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  productListReducer as plr,
  productDetailsReducer as pdr,
} from './reducers/products';
import { cartReducers as cr } from './reducers/carts';
import {
  userLoginReducer as ulr,
  userRegisterReducer as urr,
  userDetailsReducer as udr,
} from './reducers/users';

const reducer = combineReducers({
  productList: plr,
  productDetails: pdr,
  cart: cr,
  userLogin: ulr,
  userRegister: urr,
  userDetails: udr,
});
//CART INFO STORAGE
const getItems = localStorage.getItem('cartItems');
const cartItemsFromStorage =
  getItems && getItems !== 'undefined' ? JSON.parse(getItems) : [];

//USER INFO STORAGE
const getUser = localStorage.getItem('userInfo');
const userInfoFromStorage =
  getUser && getUser !== 'undefined' ? JSON.parse(getUser) : null;

const initialState = {
  cart: { cartItems: cartItemsFromStorage },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
