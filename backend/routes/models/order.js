import mongoose from 'mongoose';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

import CONS from '../../../frontend/src/utils/Constants.js';
import { capitalize } from '../../../frontend/src/utils/Globals.js';
import fld from '../../../frontend/src/utils/FieldNames.js';

const myJoiObjectId = JoiObjectId(Joi);

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: capitalize(CONS.STR_USER),
    },
    [fld.ORDERITEMS]: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: capitalize(CONS.STR_PRODUCT),
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model(capitalize(CONS.STR_ORDER), orderSchema);

function validateOrder(order, isRequired = true) {
  const schema = Joi.object({
    [fld.USER]: isRequired ? myJoiObjectId().required() : myJoiObjectId(),
    [fld.ORDERITEMS]: Joi.array().items(
      Joi.object({
        [fld.NAME]: Joi.string().required(),
        [fld.IMAGE]: Joi.string().required(),
        [fld.QTY]: Joi.number().required().min(0),
        [fld.PRICE]: Joi.number().required().min(0),
        [fld.PRODUCT]: myJoiObjectId().required(),
        [fld.COUNTINSTOCK]: Joi.number().required().min(0),
      })
    ),
    [fld.SHIPPINGADDRESS]: isRequired
      ? Joi.object()
          .keys({
            [fld.ADDRESS]: Joi.string().required(),
            [fld.COUNTRY]: Joi.string().required(),
            [fld.CITY]: Joi.string().required(),
            [fld.POSTALCODE]: Joi.string().required(),
          })
          .required()
      : Joi.object().keys({
          [fld.ADDRESS]: Joi.string(),
          [fld.COUNTRY]: Joi.string(),
          [fld.CITY]: Joi.string(),
          [fld.POSTALCODE]: Joi.string(),
        }),
    [fld.PAYMENTRESULT]: Joi.object().keys({
      [fld.ID]: Joi.string(),
      [fld.STATUS]: Joi.string(),
      [fld.UPDATETIME]: Joi.string(),
      [fld.EMAILADDRESS]: Joi.string(),
    }),
    [fld.PAYMENTMETHOD]: isRequired ? Joi.string().required() : Joi.string(),
    [fld.TAXPRICE]: isRequired
      ? Joi.number().required().min(0.0)
      : Joi.number().min(0.0),
    [fld.SHIPPINGPRICE]: isRequired
      ? Joi.number().required().min(0.0)
      : Joi.number().min(0.0),
    [fld.TOTALPRICE]: isRequired ? Joi.number().required() : Joi.number(),
    [fld.ISDELIVERED]: isRequired ? Joi.boolean().required() : Joi.boolean(),
    [fld.ISPAID]: isRequired ? Joi.boolean().required() : Joi.boolean(),
    [fld.PAIDAT]: Joi.date(),
    [fld.DELIVEREDAT]: Joi.date(),
    [fld.ITEMSPRICE]: Joi.number().min(0.0),
    //paypal check
    [fld.ID]: Joi.string(),
    [fld.INTENT]: Joi.string(),
    [fld.STATUS]: Joi.string(),
    [fld.STATUS]: Joi.string(),
    [fld.PURCHASEUNITS]: Joi.array(),
    [fld.PAYER]: Joi.object(),
    [fld.CREATETIME]: Joi.date(),
    [fld.UPDATETIME]: Joi.date(),
    [fld.LINKS]: Joi.array(),
  });
  return schema.validate(order);
}

export { Order, orderSchema, validateOrder as validate };
