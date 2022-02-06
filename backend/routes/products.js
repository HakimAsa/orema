import express from 'express';
import config from 'config';

import { Product, validate } from './models/product.js';
import validateObjectId from '../middleware/validateObjectId.js';
import fourOfour from '../utils/404.js';
import CONS from '../../frontend/src/utils/Constants.js';
import fld from '../../frontend/src/utils/FieldNames.js';
import { placeForwardslash as pfs } from '../../frontend/src/utils/Globals.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();
const setID = pfs(true, `${CONS.STR_CONS}${CONS.STR_ID}`);

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get(CONS.STR_FORWARDSLASH, async (req, res) => {
  //Pagination
  const pageSize = config.get('pageSize');
  const page = Number(req.query.pageNumber) || 1;

  //advanced filtering
  const keywords = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'gi',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keywords });

  const products = await Product.find({ ...keywords })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.send({
    success: true,
    page,
    pages: Math.ceil(count / pageSize),
    count: products.length,
    data: products,
  });
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
router.get(pfs(true, CONS.STR_TOP), async (req, res) => {
  const products = await Product.find({})
    .sort({ [fld.REVIEWRATES]: -1 })
    .limit(config.get('top'));

  res.send({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc Fetch a product by id
// @route GET /api/products/:id
// @access Public
router.get(
  pfs(true, `${CONS.STR_CONS}${fld.ID}`),
  validateObjectId,
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).send(fourOfour(CONS.STR_PRODUCT, req.params.id));
    res.send(product);
  }
);

// @desc Create a product only by admin
// @route POST /api/products
// @access Private
router.post(CONS.STR_FORWARDSLASH, [auth, admin], async (req, res) => {
  req.body.user = req.user._id;
  req.body.dimensions = `${req.body.pLength} x ${req.body.pWidth} x ${req.body.pHeight} inches`;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.create(req.body);
  res.status(201).send({ success: true, data: product });
});

// @desc Update only by admin
// @route PUT /api/products/:id
// @access Private
router.put(setID, [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validate(req.body, false);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) return res.status(404).send(fourOfour(CONS.STR_PRODUCT, id));

  const fieldToUpdate = {
    [fld.PRICE]: req.body.price ? req.body.price : product.price,
    [fld.CATEGORY]: req.body.category ? req.body.category : product.category,
    [fld.IMAGE]: req.body.image ? req.body.image : product.image,
    [fld.CAPACITY]: req.body.capacity ? req.body.capacity : product.capacity,
    [fld.WEIGHT]: req.body.weight ? req.body.weight : product.weight,
    [fld.BRAND]: req.body.brand ? req.body.brand : product.brand,
    [fld.DESCRIPTION]: req.body.description
      ? req.body.description
      : product.description,
    [fld.PHEIGHT]: req.body.pHeight ? req.body.pHeight : product.pHeight,
    [fld.PLENGTH]: req.body.pLength ? req.body.pLength : product.pLength,
    [fld.PWIDTH]: req.body.pWidth ? req.body.pWidth : product.pWidth,
    [fld.NAME]: req.body.name ? req.body.name : product.name,
    [fld.COUNTINSTOCK]: req.body.countInStock
      ? req.body.countInStock
      : product.countInStock,
  };

  fieldToUpdate.dimensions = `${fieldToUpdate.pLength} x ${fieldToUpdate.pWidth} x ${fieldToUpdate.pHeight} inches`;

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: fieldToUpdate,
    },
    { new: true }
  );
  res.status(200).send({ success: true, data: product });
});

// @desc Delete a product only by admin
// @route PUT /api/products/:id
// @access Private
router.delete(setID, [validateObjectId, auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send(fourOfour(CONS.STR_PRODUCT, req.params.id));
  res.send(product);
});

// @desc Create a review at most once
// @route POST /api/products/:id/reviews
// @access Private
router.post(
  pfs(true, setID, CONS.STR_REVIEWS),
  [validateObjectId, auth],
  async (req, res) => {
    const { reviewRates, comment } = req.body;
    req.body.user = req.user._id;

    const { error } = validate(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).send(fourOfour(CONS.STR_PRODUCT, req.params.id));

    const hasBeenReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (hasBeenReviewed)
      return res.status(400).send('You have alreday reviewed this product');

    const review = {
      [fld.NAME]: req.user.name,
      [fld.RATING]: Number(reviewRates),
      [fld.COMMENT]: comment.toString(),
      [fld.USER]: req.user._id,
    };

    product.reviews.unshift(review);

    const totalReview = product.reviews.length;

    product.totalReview = totalReview;

    product.reviewRates =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / totalReview;

    await product.save();
    res.status(201).send({ message: 'Review added ☺️' });
  }
);

export default router;
