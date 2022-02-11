import express from 'express';
import bcrypt from 'bcrypt';

import { User, validate } from './models/user.js';
import admin from '../middleware/admin.js';
import auth from '../middleware/auth.js';
import validateObjectId from '../middleware/validateObjectId.js';
import fourOfour from '../utils/404.js';
import CONS from '../../frontend/src/utils/Constants.js';
import fld from '../../frontend/src/utils/FieldNames.js';
import { placeForwardslash as pfs } from '../../frontend/src/utils/Globals.js';

const setID = pfs(true, `${CONS.STR_CONS}${CONS.STR_ID}`);
const router = express.Router();
// @desc get all users by admin only
// @route GET /api/users
// @access Private
router.get(CONS.STR_FORWARDSLASH, [auth, admin], async (req, res) => {
  const users = await User.find({});
  const count = await User.countDocuments({});
  res.send({
    success: true,
    count,
    data: users,
  });
});

// @desc Create an user only by admin here isAdmin is included in body
// @route POST /api/users
// @access Private
router.post(CONS.STR_FORWARDSLASH, [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // avoiding duplicate phone number
  let userPhone = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (userPhone)
    return res
      .status(400)
      .send(
        `Sorry! The phone number ${userPhone.phoneNumber} you provided has already been used`
      );

  // avoiding duplicate email on registration
  let newUser = await User.findOne({ email: req.body.email });
  if (newUser)
    return res
      .status(400)
      .send(`User with the email ${newUser.email} already registered.`);

  newUser = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  newUser = await newUser.save();

  const token = newUser.generateAuthToken();
  newUser
    ? res
        .header('x-auth-token', token)
        .status(201)
        .send({ success: true, data: newUser })
    : res.status(400).send('Invalid data');
});

// @desc Update non-admin users details if you are an admin
// @route PUT /api/users:id
// @access Private
router.put(setID, [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validate(req.body, false);
  if (error) return res.status(400).send(error.details[0].message);
  const id = req.params.id;

  const existedUser = await User.findById(id);
  if (!existedUser) return res.status(404).send(fourOfour(CONS.STR_USER, id));

  if (
    req.user.isAdmin &&
    existedUser.isAdmin &&
    req.user._id.toString() !== id.toString()
  )
    return res.status(401).send({
      access: 'not authorized',
      error_msg: 'You can only update non-admin users or your own account',
      description: `${req.user.name} is an admin. Please do not update other admin details`,
    });

  const salt = await bcrypt.genSalt(10);
  req.body.password =
    req.body.password && (await bcrypt.hash(req.body.password, salt));

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send(fourOfour(CONS.STR_USER, req.params.id));
  res.send(user);
});

// @desc delete user from db by admin only
// @route DELETE /api/users/:id
// @access Private
router.delete(setID, [validateObjectId, auth, admin], async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).send(fourOfour(CONS.STR_USER, id));

  if (
    req.user._id.toString() !== id.toString() &&
    req.user.isAdmin &&
    user.isAdmin
  )
    return res
      .status(401)
      .send('You can only delete your own account or non admin users☹️');

  user.remove();
  res.send({
    success: true,
    successMessage: `User ${user.name} has been deleted successfully`,
    data: user,
  });
});

export default router;
