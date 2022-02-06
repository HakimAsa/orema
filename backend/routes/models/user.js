import mongoose from 'mongoose';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

import CONS from '../../../frontend/src/utils/Constants.js';
import { capitalize } from '../../../frontend/src/utils/Globals.js';
const Schema = mongoose.Schema;

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      sparse: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      maxlength: 1024,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      maxlength: 15,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    userImage: {
      type: String,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestapms: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Generate Token using jwt
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, name: this.name },
    config.get('jwtPrivateKey'),
    {
      expiresIn: config.get('jwtExpiresIn'),
    }
  );
  return token;
};

//Match user entered password with the hashed password in db
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade Delete orders when a user is deleted
userSchema.pre('remove', async function (next) {
  await this.model(capitalize(CONS.STR_ORDER)).deleteMany({ user: this._id });
  next();
});

// Reverse Poplulate orders associated with users with virtuals
userSchema.virtual(CONS.STR_ORDERS, {
  ref: capitalize(CONS.STR_ORDER),
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

const User = mongoose.model('User', userSchema);

function validateUser(user, isRequired = true) {
  const schema = Joi.object({
    name: isRequired
      ? Joi.string().min(3).max(50).required()
      : Joi.string().min(3).max(50),
    isAdmin: Joi.boolean(),
    userImage: Joi.string(),
    address: Joi.string(),
    id: Joi.string(),
    email: isRequired
      ? Joi.string().min(5).max(255).required().email()
      : Joi.string().min(5).max(255).email(),
    phoneNumber: Joi.string()
      .max(15)
      .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
    password: isRequired
      ? passwordComplexity(complexityOptions).required()
      : passwordComplexity(complexityOptions).allow(''),
    resetPasswordToken: Joi.string(),
    resetPasswordExpire: Joi.date(),
  });
  return schema.validate(user);
}

export { User, userSchema, validateUser as validate };
