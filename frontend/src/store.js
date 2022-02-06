import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  productListReducer as plr,
  productDetailsReducer as pdr,
} from './reducers/products';
import { cartReducers as cr } from './reducers/carts';
import {
  orderCreateReducers as ocr,
  orderDetailsReducers as odr,
  orderPayReducers as opr,
  orderMyListReducers as omlr,
} from './reducers/orders';
import {
  userLoginReducer as ulr,
  userRegisterReducer as urr,
  userDetailsReducer as udr,
  userUpdateProfileReducer as uupr,
} from './reducers/users';
import CONS from './utils/Constants';

const reducer = combineReducers({
  productList: plr,
  productDetails: pdr,
  cart: cr,
  userLogin: ulr,
  userRegister: urr,
  userDetails: udr,
  userUpdateProfile: uupr,
  orderCreate: ocr,
  orderDetails: odr,
  orderPay: opr,
  orderMyList: omlr,
});
//CART INFO STORAGE
const getItems = localStorage.getItem('cartItems');
const cartItemsFromStorage =
  getItems && getItems !== 'undefined' ? JSON.parse(getItems) : [];

//USER INFO STORAGE
const getUser = localStorage.getItem('userInfo');
const userInfoFromStorage =
  getUser && getUser !== 'undefined' ? JSON.parse(getUser) : null;

//SHIPPING ADDRESS INFO STORAGE
const getShippingAddress = localStorage.getItem(CONS.STR_SHIPPING_ADDRESS);
const shippingAddressFromStorage =
  getShippingAddress && getShippingAddress !== 'undefined'
    ? JSON.parse(getShippingAddress)
    : {};

//PAYMENT METHOD INFO STORAGE
const getPaymentMethod = localStorage.getItem(CONS.STR_PAYMENTMETHOD);
const paymentMethodFromStorage =
  getPaymentMethod && getPaymentMethod !== 'undefined'
    ? JSON.parse(getPaymentMethod)
    : null;

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    [CONS.STR_SHIPPING_ADDRESS]: shippingAddressFromStorage,
    [CONS.STR_PAYMENTMETHOD]: paymentMethodFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
