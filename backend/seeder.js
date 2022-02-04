import mongoose from 'mongoose';
import config from 'config';
import colors from 'colors';

import users from './data/users.js';
import products from './data/products.js';
import { Order } from './routes/models/order.js';
import { Product } from './routes/models/product.js';
import { User } from './routes/models/user.js';
import db from './startup/db.js';

db();

const importData = async () => {
  try {
    //detroy existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    //repopulate db collections
    const addUsers = await User.insertMany(users);

    const adminUser = addUsers[0]._id;

    const sampleProduct = products.map((p) => {
      return { ...p, user: adminUser };
    });

    await Product.insertMany(sampleProduct);

    console.log('Data imported with success!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    //detroy existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed with success!'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

process.argv[2] === '-d' ? destroyData() : importData();
