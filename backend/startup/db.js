import colors from 'colors';
import mongoose from 'mongoose';
import winston from 'winston';
import config from 'config';

export default function () {
  const db = config.get('db');
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // into for unique names
    })
    .then(() => winston.info(`connected to ${db}...`.cyan.underline.bold))
    .catch((ex) => {
      console.log(ex.message.red.underline.bold);
      winston.error(ex);
    });
}
//const uri = "mongodb+srv://oremashop:<password>@cluster0.lxd3q.mongodb.net/<oremashop>?retryWrites=true&w=majority";
