import express from 'express';
import config from 'config';

import validateObjectId from '../middleware/validateObjectId.js';
import fourOfour from '../utils/404.js';
import { Product } from './models/product.js';
import CONS from '../../frontend/src/utils/Constants.js';
import fld from '../../frontend/src/utils/FieldNames.js';
import { placeForwardslash as pfs } from '../../frontend/src/utils/Globals.js';
import auth from '../middleware/auth.js';

const router = express.Router();

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
        category: {
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

// @desc Fetch a product by id
// @route GET /api/products/:id
// @access Public
router.get(
  pfs(true, `${CONS.STR_CONS}${fld.ID}`),
  validateObjectId,
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).send(fourOfour(CONS.STR_PRODUCTS, req.params.id));
    res.send(product);
  }
);

// @desc Create a product
// @route POST /api/products
// @access Private
router.post(
  pfs(true, `${CONS.STR_CONS}${fld.ID}`),
  [validateObjectId, auth],
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).send(fourOfour(CONS.STR_PRODUCTS, req.params.id));
    res.send(product);
  }
);

export default router;
