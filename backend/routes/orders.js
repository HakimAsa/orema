import express from 'express';
import config from 'config';

import { Order, validate } from './models/order.js';
import validateObjectId from '../middleware/validateObjectId.js';
import fourOfour from '../utils/404.js';
import CONS from '../../frontend/src/utils/Constants.js';
import fld from '../../frontend/src/utils/FieldNames.js';
import { placeForwardslash as pfs } from '../../frontend/src/utils/Globals.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();
const setID = pfs(true, `${CONS.STR_CONS}${CONS.STR_ID}`);

// @desc Fetch all orders by admins only
// @route GET /api/orders
// @access Private
router.get(CONS.STR_FORWARDSLASH, [auth, admin], async (req, res) => {
  const orders = await Order.find({}).populate(
    CONS.STR_USER,
    `${fld.ID} ${fld.NAME}`
  );
  res.send({ success: true, count: orders.length, data: orders });
});

// @desc Fetch all logged in user orders
// @route GET /api/orders/myorders
// @access Private
router.get(pfs(true, CONS.STR_MYORDERS), auth, async (req, res) => {
  const myOrders = await Order.find({ user: req.user._id });
  res.send({ success: true, count: myOrders.length, data: myOrders });
});

// @desc order by id
// @route GET /api/orders/:id
// @access Private
router.get(setID, [validateObjectId, auth], async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: CONS.STR_USER,
    select: 'name email',
  });
  if (req.params.id.toString() !== req.user._id.toString() && !req.user.isAdmin)
    return res.status(401).send('You can only see your own order☹️');

  if (!order)
    return res.status(404).send(fourOfour(CONS.STR_ORDER, req.params.id));
  res.send({ success: true, data: order });
});

// @desc update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
router.put(
  pfs(true, setID, CONS.STR_PAY),
  [validateObjectId, auth],
  async (req, res) => {
    const { error } = validate(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const order = await Order.findById(req.params.id);
    if (
      req.params.id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    )
      return res.status(401).send('You can only see your own order☹️');

    if (!order)
      return res.status(404).send(fourOfour(CONS.STR_ORDER, req.params.id));
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      [fld.ID]: req.body.id,
      [fld.STATUS]: req.body.status,
      [fld.UPDATETIME]: req.body.update_time,
      [fld.EMAILADDRESS]: req.body.payer.email_address,
    };

    const updatedOrder = order.save();
    res.send({ success: true, data: updatedOrder });
  }
);

// @desc Create new order
// @route POST /api/orders
// @access Private

router.post(CONS.STR_FORWARDSLASH, auth, async (req, res) => {
  pfs(true, CONS.STR_ORDERS);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  req.body.user = req.user._id;
  req.body.isDelivered = false; //todo
  req.body.isPaid = false; //todo

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (orderItems && !orderItems.length)
    return res.status(400).send('No order items found');

  const order = new Order({
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  });

  const reatedOrder = await order.save();
  res.status(201).send({ success: true, data: reatedOrder });
});

export default router;
