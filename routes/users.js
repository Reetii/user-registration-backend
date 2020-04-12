const express = require('express');
const {
  getUsers,
  getUser,
  createUser
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const { protect} = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getUsers)
  .post(createUser);



module.exports = router;
