import asyncHandler from 'express-async-handler';
const admin = asyncHandler(async function (req, res, next) {
  if (req.user && !req.user.isAdmin)
    return res.status(403).send('Access denied for non admin users.');
  next();
});
export default admin;
