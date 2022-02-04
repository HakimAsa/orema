import 'express-async-errors';
import express from 'express';
import winston from 'winston';
import config from 'config';
const app = express();

import products from './data/products.js';

import logging from './startup/logging.js';
logging();

import routes from './startup/routes.js';
routes(app);

import cfg from './startup/config.js';
cfg();

import db from './startup/db.js';
db();

import prod from './startup/prod.js';
prod(app);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const port = process.env.PORT || config.get('port');
const env = process.env.NODE_ENV || config.get('dev');

const server = app.listen(port, () =>
  winston.info(
    `Listening on port ${port} in ${env} mode...`.yellow.underline.bold
  )
);

export default server;
