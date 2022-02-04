import Joi from 'joi';
import _ from 'lodash';
import express from 'express';
import passwordComplexity from 'joi-password-complexity';
import bcrypt from 'bcrypt';
import config from 'config';
import crypto from 'crypto';

import { User, validate } from './models/user.js';
import fourOfour from '../utils/404.js';
import auth from '../middleware/auth.js';
// import userAvatar from '../utils/userAvatar.js';
// import sendEmail from '../utils/sendEmail.js';
import CONS from '../../frontend/src/utils/Constants.js';
import { placeForwardslash as pfs } from '../../frontend/src/utils/Globals.js';
import { ENDPOINTS as eps } from '../../frontend/src/utils/EndPoints.js';
import fld from '../../frontend/src/utils/FieldNames.js';

// const path = from"path";
// const fs = from"fs";
// const upload = from"../api/multerHelpers";
// const imageErr = from"../utils/errorOnImageUpload");
// const bucket = config.get("S3_BUCKET");

const router = express.Router();

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

// @desc register a user
// @route POST /api/auth/register
// @access Public
router.post('/register', async (req, res) => {
  const { name, address, email, phoneNumber, userImage, password } = req.body;

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // avoiding duplicate phone number
  let userPhone = await User.findOne({ phoneNumber });
  if (userPhone)
    return res
      .status(400)
      .send(
        `Sorry! The phone number ${userPhone.phoneNumber} you provided has already been used`
      );

  // avoiding duplicate email on registration
  let newUser = await User.findOne({ email: email });
  if (newUser)
    return res
      .status(400)
      .send(`User with the email ${newUser.email} already registered.`);

  newUser = new User({
    name,
    userImage,
    email,
    phoneNumber,
    password,
    address,
  });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  newUser = await newUser.save();

  if (newUser) {
    const token = newUser.generateAuthToken();
    res
      .header('x-auth-token', token)
      .status(201)
      .send(
        _.pick(newUser, [
          '_id',
          'name',
          'email',
          'phoneNumber',
          'address',
          'userImage',
        ])
      );
  } else {
    res.status(400).send('Invalid data');
  }
});

// @desc log in a user
// @route POST /api/auth/login
// @access Public
router.post(pfs(true, eps.LOGIN), async (req, res) => {
  const { error } = validateOnLogin(req.body);
  const { email, password } = req.body;
  const errMsg = 'Invalid email or password';

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email }).select(
    '_id email isAdmin  name phoneNumber userImage address password'
  );
  if (!user) return res.status(400).send({ message: errMsg });

  //Match user entered password with the hashed password in db
  const validPassword = await user.matchPassword(password);
  if (!validPassword) {
    return res.status(400).send({ message: errMsg });
  }
  user = await user.save();
  sendTokenResponse(user, 200, res);
});

//@desc get user logged out / clear cookie
// @route GET /api/auth/logout
// @access Private
router.get(pfs(true, eps.LOGOUT), auth, async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now + 10 * 1000),
    httpOnly: true,
  });

  res.send({ success: true, data: {} });
});

//@desc get logged in user
// @route GET /api/auth/me
// @access Private
router.get(pfs(true, eps.ME), auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return res
      .status(400)
      .send({ message: 'User not found' })
      .populate({ path: eps.ORDERS });
  res.send({ success: true, data: user });
});

//@desc update user details
// @route PUT /api/auth/updatedetails
// @access Private
router.put(pfs(true, eps.UPDATEDETAILS), auth, async (req, res) => {
  let user = await User.findById(req.user._id).exec();
  if (!user)
    return res.status(404).send(fourOfour(CONS.STR_USER, req.user._id));

  const { error } = validate(req.body, false);
  const fieldToUpdate = {
    [fld.EMAIL]: req.body.email ? req.body.email : user.email,
    [fld.PHONENUMBER]: req.body.phoneNumber
      ? req.body.phoneNumber
      : user.phoneNumber,
    [fld.USERIMAGE]: req.body.userImage ? req.body.userImage : user.userImage,
    [fld.ADDRESS]: req.body.address ? req.body.address : user.address,
    [fld.NAME]: req.body.name ? req.body.name : user.name,
    [fld.PASSWORD]: req.body.password && req.body.password,
  };

  if (error) return res.status(400).send(error.details[0].message); //todo

  user = await User.findByIdAndUpdate(req.user._id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });
  if (!user)
    return res.status(404).send(fourOfour(CONS.STR_USER, req.params.id));

  res.send(
    _.pick(user, [
      '_id',
      'name',
      'email',
      'phoneNumber',
      'address',
      'userImage',
    ])
  );
});

// @desc Forgot password
// @route POST /api/user/forgotpassword
// @access Public
router.post('/forgotpassword', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send(fourOfour(CONS.USER, req.body.email));

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetpassword/${resetToken}`;
  const message = `Your are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgort Password reset token',
      message,
    });
    res.status(200).send({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).send('Email could not be sent!');
  }
});

// @desc reset password
// @route PUT /api/user/resetpassword/:resettoken
// @access Public
router.put('/resetpassword/:resettoken', async (req, res) => {
  // require secure password
  const { error } = validateResetPassword(req.body);
  let { password } = req.body;

  if (error) return res.status(400).send(error.details[0].message);

  //Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).send('Invalid token!');

  // hash password in body request
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendTokenResponse(user, 200, res);
});

//@desc update password
// @route PUT /api/auth/updatepassword
// @access Private
router.put(pfs(true, eps.UPDATEPASSWORD), auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  //Check current password
  if (!(await user.matchPassword(req.body.currentPassword)))
    return res.status(401).send('Password is incorrect!');
  // hash password in body request
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);

  //saving user password to db
  await user.save();
  sendTokenResponse(user, 200, res);
  //res.send({ success: true, data: user });
});

function validateOnLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(30).required(),
  });
  return schema.validate(req);
}

function validateResetPassword(req) {
  const schema = Joi.object({
    password: passwordComplexity(complexityOptions).min(8).max(30).required(),
  });
  return schema.validate(req);
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();
  const exp = Date.now() + config.get('jwtCookieExpire') * 24 * 60 * 60 * 1000; //1day
  const options = {
    expires: new Date(exp),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token_type: 'Bearer',
      message: 'successfully authenticated',
      token,
      [fld.ISADMIN]: user.isAdmin,
      [fld.NAME]: user.name,
      [`_${fld.ID}`]: user._id,
      [fld.EMAIL]: user.email,
      [fld.ADDRESS]: user.address,
      [fld.PHONENUMBER]: user.phoneNumber,
      [fld.USERIMAGE]: user.userImage,
      expiresIn: exp,
    });
};

export default router;
