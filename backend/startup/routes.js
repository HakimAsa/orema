import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import config from 'config';

import cors from 'cors';
import cookieParser from 'cookie-parser';

//relative paths
import error, { notFound } from '../middleware/error.js';
import { placeForwardslash as pfs } from '../../frontend/src/utils/Globals.js';
import CONS from '../../frontend/src/utils/Constants.js';
import { ENDPOINTS as eps } from '../../frontend/src/utils/EndPoints.js';
import auth from '../routes/auth.js';
import orders from '../routes/orders.js';
import products from '../routes/products.js';
import users from '../routes/users.js';

export default function (app) {
  app.use(cors());
  // Prevent XSS attacks
  // app.use(xss());

  //Sanitize data
  app.use(mongoSanitize());
  // secure headers
  app.use(helmet());

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser());

  app.use('/api/uploads', express.static('api/uploads'));
  app.use('/api/productImages', express.static('api/productImages'));
  app.use('/api/userImages', express.static('api/userImages'));
  app.use(pfs(true, eps.API, eps.AUTH), auth);
  app.use(pfs(true, eps.API, eps.ORDERS), orders);
  app.use(pfs(true, eps.API, eps.PRODUCTS), products);
  app.use(pfs(true, eps.API, eps.USERS), users);
  app.get(pfs(true, eps.API, eps.CONFIG, eps.PAYPAL), async (req, res) =>
    res.send(config.get('paypal_client_id'))
  );

  //global error middleware
  app.use(notFound);
  app.use(error);
}
